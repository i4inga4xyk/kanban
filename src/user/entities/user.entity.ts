import { ApiProperty } from '@nestjs/swagger';
import { Project } from 'src/projects/entities/project.entity';
import { Task } from 'src/tasks/entities/task.entity';
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ example: [] })
  @ManyToMany(() => Project, (project) => project.users, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  projects: Project[];

  @ApiProperty({ example: [] })
  @ManyToMany(() => Task, (task) => task.users, {
    onDelete: 'SET NULL',
    nullable: true,
  })
  tasks: Task[];

  @ApiProperty({ example: 'example@mail.com' })
  @Column()
  email: string;

  @ApiProperty({ example: 'Vasya' })
  @Column()
  username: string;

  @ApiProperty({ example: 'Password hashed by argon2' })
  @Column()
  password_hash: string;
}
