import { Controller, Get, Post, Body, Patch, Param, Delete, UsePipes, ValidationPipe, UseGuards, Req, Query } from '@nestjs/common';
import { StatusService } from './status.service';
import { CreateStatusDto } from './dto/create-status.dto';
import { ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';

@ApiTags('Status Module')
@Controller('status')
export class StatusController {
  constructor(private readonly statusService: StatusService) {}

  @UsePipes(new ValidationPipe())
  @UseGuards(JwtAuthGuard)
  @Post()
  create(@Body() createStatusDto: CreateStatusDto, @Req() req) {
    return this.statusService.create(createStatusDto, +req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  findAll(@Query('projectId') projectId: string, @Req() req) {
    return this.statusService.findAll(+projectId, +req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  findOne(@Param('id') id: string, @Req() req) {
    return this.statusService.findOne(+id, +req.user.id);
  }

  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  remove(@Param('id') id: string, @Req() req) {
    return this.statusService.remove(+id, +req.user.id);
  }
}
