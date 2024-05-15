import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsString, MaxLength } from 'class-validator';
import { Project } from 'src/projects/entities/project.entity';
import { Status } from 'src/status/entities/status.entity';

export class CreateTaskDto {
  @ApiProperty({ example: 'Test task' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  title: string;

  @ApiProperty({ example: 'Description of the task' })
  @IsString()
  description: string;

  @ApiProperty({ example: 1, description: 'Project id' })
  @IsNotEmpty()
  @IsNumber()
  project: Project;

  @ApiProperty({ example: 1, description: 'Status id' })
  @IsNotEmpty()
  @IsNumber()
  status: Status;
}
