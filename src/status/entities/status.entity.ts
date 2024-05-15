import { ApiProperty } from '@nestjs/swagger';
import { Project } from 'src/projects/entities/project.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Status {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Completed' })
  @Column()
  title: string;

  @ApiProperty({ type: () => Project })
  @ManyToOne(() => Project, { eager: true })
  project: Project;
}
