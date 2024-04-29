import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task) private readonly taskRepository: Repository<Task>,
    private readonly userService: UserService,
    private readonly projectService: ProjectsService
  ) {}

  async create(createTaskDto: CreateTaskDto, userId: number) {
    const task = {
      title: createTaskDto.title,
      description: createTaskDto.description,
      project: {id: +createTaskDto.project},
    }
    
    const project = await this.projectService.findOne(+createTaskDto.project, userId);
    if (!project) throw new ForbiddenException('Access forbidden.');

    return this.taskRepository.save(task);
  }

  async findAll(projectId: number, page: number, limit: number, userId: number) {
    const userInProject = await this.projectService.findOne(projectId, userId);
    
    page < 1 ? page = 1 : page;
    limit < 0 ? limit = 0 : limit;

    return await this.taskRepository.find({
      where: {
      project: {id: userInProject.id},
      },
      order: {
        updatedAt: 'DESC'
      },
      take: limit,
      skip: (page - 1) * limit      
    });
  }

  async findOne(id: number, userId: number) {
    const task = await this.isExist(id);
    await this.projectService.findOne(task.project.id, userId);
    return task;
  }

  async update(taskId: number, updateTaskDto: UpdateTaskDto, userId: number) {
    const task = await this.isExist(taskId);
    const project = await this.projectService.findOne(task.project.id, userId);
    if (updateTaskDto.userId) {
      const user = await this.userService.findOne(updateTaskDto.userId);
      if (!project.users.find(users => users.id === user.id)) {
        throw new UnauthorizedException('User doesn\'t have access to this project!');
      }
      task.users.push(user);
    }
    task.title = updateTaskDto.title ?? task.title;
    task.description = updateTaskDto.description ?? task.title;
    return await this.taskRepository.save(task);
  }

  async remove(taskId: number, userId: number) {
    const task = await this.isExist(taskId)
    await this.projectService.findOne(task.project.id, userId);
    return await this.taskRepository.delete(taskId);
  }

  private async isExist(id: number): Promise<Task> {
    const task = await this.taskRepository.findOne({where: {id}, relations: {project: true}});
    if (!task) throw new NotFoundException('Task not found!');
    return task;
  }
}
