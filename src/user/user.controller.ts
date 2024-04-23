import { Body, Controller, Delete, Get, Param, Patch, Post, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./dto/create-user.dto";
import { User } from "./entities/user.entity";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags } from "@nestjs/swagger";

@Controller('user')
export class UserController{
    constructor(private readonly userService: UserService) {}

    @ApiTags('UserModule')
    @Get()
    findAll() {
        return this.userService.findAll()
    }

    @ApiTags('UserModule')
    @Patch(':id')
    @UsePipes(new ValidationPipe())
    update(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto
    ){
        return this.userService.update(id, updateUserDto)
    }

    @ApiTags('UserModule')
    @Delete(':id')
    remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}