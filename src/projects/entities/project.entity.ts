import { User } from "src/user/entities/user.entity";
import { Column, CreateDateColumn, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class Project {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToMany(() => User, (user) => user.projects, {nullable: true, eager: true})
    @JoinTable()
    users: User[]

    @Column()
    title: string;

    @Column()
    description: string;

    @ManyToOne(() => User, {eager: true})
    owner: User

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    
}
