import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { Project } from "src/projects/entities/project.entity";
import { Status } from "src/status/entities/status.entity";

export class CreateTaskDto {
    @ApiProperty()
    @IsString()
    @IsNotEmpty()
    @MaxLength(20)
    title: string;

    @ApiProperty()
    @IsString()
    description: string;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    project: Project;

    @ApiProperty()
    @IsNotEmpty()
    @IsNumber()
    status: Status;
}
