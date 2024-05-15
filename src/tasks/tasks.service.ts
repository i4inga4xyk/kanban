import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { ProjectsService } from 'src/projects/projects.service';
import { IPaginatedResponse } from 'src/types/paginated-response.dto';
import { StatusService } from 'src/status/status.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    private readonly projectService: ProjectsService,
    private readonly statusService: StatusService,
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {
    const task = {
      title: createTaskDto.title,
      description: createTaskDto.description,
      project: { id: +createTaskDto.project },
      status: { id: +createTaskDto.status },
    };

    await this.statusService.findOne(+createTaskDto.status, userId);
    await this.projectService.findOne(+createTaskDto.project, userId);

    return this.taskRepository.save(task);
  }

  async findAll(
    projectId: number,
    page: number,
    limit: number,
    userId: number,
  ): Promise<IPaginatedResponse<Task>> {
    await this.projectService.findOne(projectId, userId);

    page < 1 ? (page = 1) : page;
    limit < 0 ? (limit = 0) : limit;
    const [tasks, total] = await this.taskRepository.findAndCount({
      where: {
        project: { id: projectId },
      },
      order: {
        updatedAt: 'DESC',
      },
      take: limit,
      skip: (page - 1) * limit,
    });
    return {
      data: tasks,
      total: total,
      page: page,
      limit: limit,
    };
  }

  async findOne(id: number, userId: number) {
    const task = await this.isExist(id);
    await this.accessCheck(task, userId);
    return task;
  }

  async update(taskId: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const task = await this.isExist(taskId);
    await this.accessCheck(task, userId);
    if (updateTaskDto.userId) {
      const user = task.project.users.find(
        (users) => users.id === updateTaskDto.userId,
      );
      if (!user) {
        throw new UnauthorizedException(
          "User doesn't have access to this project!",
        );
      }
      if (task.users.find((users) => users.id === user.id)) {
        throw new BadRequestException(
          'User has been already added to this task!',
        );
      }
      task.users.push(user);
    }
    if (updateTaskDto.status) {
      const status = await this.statusService.findOne(
        +updateTaskDto.status,
        userId,
      );
      task.status = status;
    }
    task.title = updateTaskDto.title ?? task.title;
    task.description = updateTaskDto.description ?? task.title;
    return await this.taskRepository.save(task);
  }

  async remove(taskId: number, userId: number) {
    const task = await this.isExist(taskId);
    await this.accessCheck(task, userId);
    await this.taskRepository.delete(taskId);
    return 'Task successfully deleted!';
  }

  private async isExist(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({
      where: { id },
      relations: { project: true },
    });
    if (!task) throw new NotFoundException('Task not found!');
    return task;
  }

  private async accessCheck(task: Task, userId: number) {
    if (!task.project.users.find((users) => users.id === userId)) {
      throw new ForbiddenException('Access forbidden.');
    }
  }
}
