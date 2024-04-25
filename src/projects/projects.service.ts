import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { UserService } from 'src/user/user.service';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
    private readonly userService: UserService,
  ){}

  async create(createProjectDto: CreateProjectDto, userId: number) {
    const project = {
      title: createProjectDto.title,
      description: createProjectDto.description,
      owner: await this.userService.findOneById(userId),
      users: [await this.userService.findOneById(userId)]
    };  
    return this.projectRepository.save(project);
  }

  async findAll(userId: number) {
    return await this.projectRepository.find({
      where: {users: await this.userService.findOneById(userId)},
      relations: {users: true}
    });
  }

  async findOne(projectId: number, userId: number) {
    const project = await this.isExist(projectId);
    if (!project.users.find(users => users.id === userId)) {
      throw new UnauthorizedException('You don\'t have access to this page!');
    }
    return project;
  }
  
  async update(projectId: number, updateProjectDto: UpdateProjectDto, ownerId: number) {
    const project = await this.isExist(projectId);
    await this.isOwner(project, ownerId);
    if (updateProjectDto.userId) {
      const user = await this.userService.findOneById(updateProjectDto.userId);
      project.users.push(user)
    }
    project.title = updateProjectDto.title ?? project.title;
    project.description = updateProjectDto.description ?? project.description;
    return await this.projectRepository.save(project);
  }

  async remove(projectId: number, ownerId: number) {
    const project = await this.isExist(projectId);
    await this.isOwner(project, ownerId);
    return await this.projectRepository.delete(projectId);
  }

  async isExist(id: number): Promise<Project> {
      const project = await this.projectRepository.findOne({where: {id}});
      if (!project) throw new NotFoundException('Project not found!');
      return project;
  }

  async isOwner(project: Project, userId: number): Promise<void> {
    if (project.owner.id != userId) {
      throw new UnauthorizedException('You don\'t have access to this page!');
    }
  }
}
