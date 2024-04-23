import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
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

  async create(createProjectDto: CreateProjectDto, id: number) {
    await this.titleExist(createProjectDto.title);    
    const project = {
      title: createProjectDto.title,
      description: createProjectDto.description,
      users: await this.userRepository.findBy({id}),
    };  
    return this.projectRepository.save(project);
  }

  async findAll(id: number) {
    return await this.projectRepository.find({
      where: {users: await this.userRepository.findBy({id})},
      relations: {users: true}
    });
  }

  async findOne(id: number) {
    const project = await this.isExist(id);
    return project;
  }

  async update(id: number, updateProjectDto: UpdateProjectDto) {
    await this.isExist(id);
    //await this.titleExist(updateProjectDto.title)
    return await this.projectRepository.update(id, updateProjectDto);
  }

  async remove(id: number) {
    await this.isExist(id);
    return await this.projectRepository.delete(id);
  }

  async addUser() {}

  async isExist(id: number): Promise<void> {
      const project = await this.projectRepository.findOne({where: {id}});
      if (!project) throw new NotFoundException('Project not found!')
  }

  async titleExist(title: string): Promise<void> {
    const titleExist = await this.projectRepository.findBy({title});
    if (titleExist.length > 1) throw new BadRequestException('Project with this name already exists!');
  }
}
