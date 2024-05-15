import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { UpdateTaskDto } from './dto/update-task.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { IPaginatedResponse } from 'src/types/paginated-response.dto';
import { Task } from './entities/task.entity';

@ApiTags('TaskModule')
@Controller('tasks')
export class TasksController {
  constructor(private readonly tasksService: TasksService) {}

  @ApiOperation({ description: 'Adds a new task to the project.' })
  @ApiCreatedResponse({ description: 'Task successfully added!', type: Task })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createTaskDto: CreateTaskDto, @Req() req) {
    return this.tasksService.create(createTaskDto, +req.user.id);
  }

  @ApiOperation({
    description: 'Returns all tasks from the project for current user.',
  })
  @ApiQuery({
    name: 'projectId',
    description: 'Project Id',
    required: true,
    type: 'string',
  })
  @ApiQuery({
    name: 'page',
    description: 'Number of displayed pages',
    required: false,
    type: 'number',
  })
  @ApiQuery({
    name: 'limit',
    description: 'Number of items per page',
    required: false,
    type: 'number',
  })
  @ApiOkResponse({ description: 'All projects', type: [Task] })
  @ApiBearerAuth()
  @Get()
  @UseGuards(JwtAuthGuard)
  findAll(
    @Query('projectId') projectId: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 5,
    @Req() req,
  ): Promise<IPaginatedResponse<Task>> {
    return this.tasksService.findAll(+projectId, page, limit, +req.user.id);
  }

  @ApiOperation({
    description: 'Returns a task by id, if user is eligible to see it',
  })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiOkResponse({ description: 'Task info', type: Task })
  @ApiBearerAuth()
  @Get(':id')
  @UseGuards(JwtAuthGuard)
  findOne(@Param('id') id: string, @Req() req) {
    return this.tasksService.findOne(+id, +req.user.id);
  }

  @ApiOperation({ description: 'Updates task data.' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiOkResponse({ description: 'Updated task info', type: Task })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateTaskDto,
    @Req() req,
  ): Promise<Task> {
    return this.tasksService.update(+id, updateTaskDto, +req.user.id);
  }

  @ApiOperation({ description: 'Deletes a task by id.' })
  @ApiParam({ name: 'id', description: 'Task ID' })
  @ApiOkResponse({ description: 'Task successfully deleted!' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.tasksService.remove(+id, +req.user.id);
  }
}
