import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateProjectDto {
  @ApiProperty({ example: 'Test project' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  title: string;

  @ApiProperty({ example: 'Description for test project' })
  @IsString()
  description: string;
}
