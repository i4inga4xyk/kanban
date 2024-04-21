import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";

@Controller('user')
export class UserController{
    constructor(private readonly userService: UserService) {}

    @Get()
    findAll() {
        return this.userService.findAll()
    }

    @Patch(':id')
    update(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto
    ){
        return this.userService.update(id, updateUserDto)
    }

    @Delete(':id')
    remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}