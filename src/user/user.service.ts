import { BadRequestException, Injectable, NotFoundException } from "@nestjs/common";
import { CreateUserDto } from "./dto/create-user.dto";
import { UpdateUserDto } from "./dto/update-user.dto";
import { InjectRepository } from "@nestjs/typeorm";
import { User } from "./entities/user.entity";
import { Repository } from "typeorm";
import * as argon2 from "argon2";
import { UserSearchFields } from "src/types/types";

@Injectable()
export class UserService{
    constructor (
        @InjectRepository(User) private readonly userRepository: Repository<User>
    ) {}

    async create(createUserDto: CreateUserDto) {
        const isExist = await this.userRepository.findOne({
            where: [
                {email: createUserDto.email},
                {username: createUserDto.username}
            ]
        })
        if (isExist) throw new BadRequestException('This email and/or username is already taken!')

        return this.userRepository.save({
            email: createUserDto.email,
            username: createUserDto.username,
            password_hash: await argon2.hash(createUserDto.password)
        });
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
        await this.userRepository.update(
            id,
            {
                email: updateUserDto.email,
                username: updateUserDto.username,
                password_hash: hash,           
            }
        )
        return "User successfully updated!"
    }

    async findOne(field: UserSearchFields, value: string | number) {
        const userExists = await this.userRepository.findOne({where: {[field]: value}})
        if (!userExists) {
            throw new NotFoundException('User not found!');
        }
        return userExists;
    }

    async findAll() {
        return await this.userRepository.find();
    }

    async remove(id: number) {
        await this.userRepository.delete({id: id})
        return "User successfully deleted!"
    }
}