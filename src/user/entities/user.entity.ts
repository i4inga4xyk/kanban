import { Project } from "src/projects/entities/project.entity";
import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => Project, (project) => project.users, {onDelete: "SET NULL", nullable: true})
    projects: Project[]

    @Column()
    email: string;

    @Column()
    username: string;

    @Column()
    password_hash: string;
}