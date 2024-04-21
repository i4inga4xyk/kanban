import { Injectable } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import * as argon2 from "argon2";

@Injectable()
export class UserService{
    constructor (
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    async create(createUserDto: CreateUserDto) {
        const user = await this.userRepository.save({
            email: createUserDto.email,
            username: createUserDto.username,
            password_hash: await argon2.hash(createUserDto.password),
        })
    }

    update(updateUserDto: UpdateUserDto) {
        return 'User is updated';
    }

    async findOne(email: string) {
        return await this.userRepository.findOne({
            where: {
                email: email
            } 
        })
    }

    async findAll() {
        return await this.userRepository.find();
    }

    async remove(id: number) {
        return await this.userRepository.delete({
            id: id
        })
    }
}