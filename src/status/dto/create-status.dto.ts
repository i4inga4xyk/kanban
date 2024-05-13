import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsNumber, IsString, MaxLength } from "class-validator";
import { Project } from "src/projects/entities/project.entity";

export class CreateStatusDto {
    @ApiProperty({example: "Completed"})
    @IsString()
    @MaxLength(20)
    @IsNotEmpty()
    title: string;

    @ApiProperty({example: 1, description: "Project id"})
    @IsNotEmpty()
    @IsNumber()
    project: Project;
}
