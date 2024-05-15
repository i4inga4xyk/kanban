import { ApiProperty } from '@nestjs/swagger';
import { Project } from 'src/projects/entities/project.entity';
import { Status } from 'src/status/entities/status.entity';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Task {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: 'Test task' })
  @Column()
  title: string;

  @ApiProperty({ example: 'Description of the task' })
  @Column()
  description: string;

  @ApiProperty({ type: () => Status })
  @ManyToOne(() => Status)
  @JoinColumn()
  status: Status;

  @ApiProperty({ example: new Date().toISOString() })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: new Date().toISOString() })
  @UpdateDateColumn()
  updatedAt: Date;

  @ApiProperty({ type: () => Project })
  @ManyToOne(() => Project)
  project: Project;

  @ApiProperty({ type: () => User })
  @ManyToMany(() => User, (user) => user.tasks, { nullable: true, eager: true })
  @JoinTable()
  users: User[];
}
