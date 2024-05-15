import { ApiProperty } from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity()
export class Project {
  @ApiProperty({ example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ type: () => [User] })
  @ManyToMany(() => User, (user) => user.projects, {
    nullable: true,
    eager: true,
  })
  @JoinTable()
  users: User[];

  @ApiProperty({ example: 'Test project' })
  @Column()
  title: string;

  @ApiProperty({ example: 'Description for test project' })
  @Column()
  description: string;

  @ApiProperty({ type: () => User })
  @ManyToOne(() => User, { eager: true })
  owner: User;

  @ApiProperty({ example: new Date().toISOString() })
  @CreateDateColumn()
  createdAt: Date;

  @ApiProperty({ example: new Date().toISOString() })
  @UpdateDateColumn()
  updatedAt: Date;
}
