import { ForbiddenException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { CreateStatusDto } from './dto/create-status.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Status } from './entities/status.entity';
import { Repository } from 'typeorm';
import { ProjectsService } from 'src/projects/projects.service';

@Injectable()
export class StatusService {
  constructor (
    @InjectRepository(Status) private readonly statusRepository: Repository<Status>,
    private readonly projectService: ProjectsService
  ) {}

  async create(createStatusDto: CreateStatusDto, userId: number) {
    const status = {
      title: createStatusDto.title,
      project: {id: +createStatusDto.project}
    };

    const project = await this.projectService.findOne(+createStatusDto.project, userId);

    if (project.owner.id != userId) {
      throw new UnauthorizedException('Access forbidden.')
    };
    
    return await this.statusRepository.save(status);
  }

  async findAll(projectId: number, userId: number) {
    await this.projectService.findOne(projectId, userId);

    return await this.statusRepository.find({where: {project: {id: projectId}}, loadEagerRelations: false});
  }

  async findOne(id: number, userId: number) {
    const status = await this.statusRepository.findOne({where: {id}});
    if (!status) {
      throw new NotFoundException('Status not found!')
    }

    if (!status.project.users.find(users => users.id === userId)) {
      throw new ForbiddenException('Access forbidden.');
    }

    return status;
  }

  async remove(id: number, userId: number) {
    const status = await this.statusRepository.findOne({where: {id}});
    if (!status) {
      throw new NotFoundException('Status not found!')
    }

    if (status.project.owner.id != userId) {
      throw new ForbiddenException('Access forbidden.');
    }
    
    await this.statusRepository.delete({id});
    
    return "Status successfully deleted!";
  }
}
