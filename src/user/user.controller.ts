import { Body, Controller, Delete, Get, Param, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";

@Controller('user')
export class UserController{
    constructor(private readonly userService: UserService) {}

    @Post()
    @UsePipes(new ValidationPipe())
    create(@Body() createUserDto: CreateUserDto) {
        return this.userService.create(createUserDto);
    }

    @Get()
    findAll(email: string) {
        return this.userService.findOne(email)
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
    return this.userService.remove(+id);
  }
}