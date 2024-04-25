import { Injectable, NotFoundException } from "@nestjs/common";
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
    return user;
    }

    async update(id: number, updateUserDto: UpdateUserDto) {
        const notExistsUser = await this.userRepository.findOne({
            where: {id}
        })
        if (!notExistsUser) throw new NotFoundException('User not found.')
        
        let hash: string | undefined;
        if (updateUserDto.password) {
            hash = await argon2.hash(updateUserDto.password);
        }
        return await this.userRepository.update(
            id,
            {
                email: updateUserDto.email,
                username: updateUserDto.username,
                password_hash: hash,           
            }
        )
    }

    async findOneByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email } })
        if (!user) {
            throw new NotFoundException('User not found!')
        }
        return user;
    }

    async findOneByUsername(username: string) {
        const user = await this.userRepository.findOne({ where: { username } })
        if (!user) {
            throw new NotFoundException('User not found!')
        }
        return user;
    }

    async findOneById(id: number) {
        const user = await this.userRepository.findOne({ where: { id } })
        if (!user) {
            throw new NotFoundException('User not found!')
        }
        return user;
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