import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './entities/project.entity';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(Project) private readonly projectRepository: Repository<Project>,
    @InjectRepository(User) private readonly userRepository: Repository<User>
  ){}

  async create(createProjectDto: CreateProjectDto, userId: number) {
    const project = {
      title: createProjectDto.title,
      description: createProjectDto.description,
      owner: await this.userRepository.findOne({where: {id: userId}}),
      users: await this.userRepository.findBy({id: userId})
    };  
    return this.projectRepository.save(project);
  }

  async findAll(userId: number) {
    return await this.projectRepository.find({
      where: {users: await this.userRepository.findBy({id: userId})},
     relations: {users: true}
    });
  }

  async findOne(projectId: number, userId: number) {
    await this.isExist(projectId);

    const isSignedIn = await this.projectRepository.find({
      relations: {users: true},
      where: {
        id: projectId,
        users: await this.userRepository.findOne({where: {id: userId}})
      }
    });
    if (!isSignedIn.length) throw new UnauthorizedException('You don\'t have access to this page!');

    return await this.projectRepository.find({
      where: {id : projectId}
    });
  }

  async update(projectId: number, updateProjectDto: UpdateProjectDto, ownerId: number) {
    const project = await this.isExist(projectId);
    await this.isOwner(projectId, ownerId);
    console.log(project);
    if (updateProjectDto.userId) {
      const user = await this.userRepository.findOne({where: {id: updateProjectDto.userId}});
      project.users.push(user)
    }
    project.title = updateProjectDto.title ?? project.title;
    project.description = updateProjectDto.description ?? project.description;
    return await this.projectRepository.save(project);
  }

  async remove(projectId: number, ownerId: number) {
    await this.isExist(projectId);
    await this.isOwner(projectId, ownerId);
    return await this.projectRepository.delete(projectId);
  }

  async isExist(id: number): Promise<Project> {
      const project = await this.projectRepository.findOne({where: {id}});
      if (!project) throw new NotFoundException('Project not found!');
      return project;
  }

  async isOwner(projectId:number, userId: number): Promise<void> {
    const isSignedIn = await this.projectRepository.find({
      where: {
        id: projectId,
        owner: await this.userRepository.findOne({where: {id: userId}})
      }
    });
    if (!isSignedIn.length) throw new UnauthorizedException('You don\'t have access to this page!');
  }
}
