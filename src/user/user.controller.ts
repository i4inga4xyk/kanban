import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

@Controller('user')
export class UserController{
    constructor(private readonly userService: UserService) {}

    @Get()
    findAll() {
        return this.userService.findAll()
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}