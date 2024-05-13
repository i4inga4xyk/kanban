import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiParam, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Project } from './entities/project.entity';

@ApiTags('ProjectModule')
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @ApiOperation({description: "Creates a new project."})
  @ApiCreatedResponse({description: "Project successfully created!", type: Project})
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createProjectDto: CreateProjectDto, @Req() req) {
    return this.projectsService.create(createProjectDto, +req.user.id);
  }

  @ApiOperation({description: "Returns all projects linked to current user."})
  @ApiOkResponse({description: "All projects", type: [Project]})
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Req() req) {
    return this.projectsService.findAll(+req.user.id);
  }

  @ApiOperation({description: "Returns a project by its id, if current user is linked to it."})
  @ApiParam({name: "id", description: "Project ID"})
  @ApiOkResponse({description: "Project info", type: Project})
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.projectsService.findOne(+id, +req.user.id);
  }

  @ApiOperation({description: "Updates project data; only accessible to the owner of the project"})
  @ApiParam({name: "id", description: "Project ID"})
  @ApiOkResponse({description: "Updated project info", type: Project})
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @Req() req) {
    return this.projectsService.update(+id, updateProjectDto, +req.user.id);
  }

  @ApiOperation({description: "Deletes a project by id; only accessible to the owner of the project."})
  @ApiParam({name: "id", description: "Project ID"})
  @ApiOkResponse({description: "Project successfully deleted!"})
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.projectsService.remove(+id, +req.user.id);
  }
}
