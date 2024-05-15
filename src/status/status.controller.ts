import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  UsePipes,
  ValidationPipe,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
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
import { Status } from './entities/status.entity';

@ApiTags('Status Module')
@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @ApiOperation({ description: 'Creates a new status for the project.' })
  @ApiCreatedResponse({
    description: 'Status successfully created!',
    type: Status,
  })
  @ApiBearerAuth()
  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createStatusDto: CreateStatusDto, @Req() req) {
    return this.statusService.create(createStatusDto, +req.user.id);
  }

  @ApiOperation({ description: 'Returns all of the statuses for the project.' })
  @ApiQuery({
    name: 'projectId',
    description: 'Project ID',
    required: true,
    type: 'string',
  })
  @ApiOkResponse({ description: 'All statuses', type: Status })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('projectId') projectId: string, @Req() req) {
    return this.statusService.findAll(+projectId, +req.user.id);
  }

  @ApiOperation({ description: 'Returns a status by its id.' })
  @ApiParam({ name: 'id', description: 'Status ID' })
  @ApiOkResponse({ description: 'Current status', type: Status })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.statusService.findOne(+id, +req.user.id);
  }

  @ApiOperation({
    description:
      'Deletes a status from the project; available only for the owner of the project',
  })
  @ApiParam({ name: 'id', description: 'Status ID' })
  @ApiOkResponse({ description: 'Status successfully deleted!' })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.statusService.remove(+id, +req.user.id);
  }
}
