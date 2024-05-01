import { Project } from "src/projects/entities/project.entity";
import { Status } from "src/status/entities/status.entity";
import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinColumn, JoinTable, ManyToMany, ManyToOne, OneToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Task {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToOne(() => Status)
    @JoinColumn()
    status: Status;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @ManyToOne(() => Project)
    project: Project;

    @ManyToMany(() => User, (user) => user.tasks, {nullable: true, eager: true})
    @JoinTable()
    users: User[];
}