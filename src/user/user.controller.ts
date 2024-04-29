import { Body, Controller, Delete, Get, Param, Patch, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiTags } from "@nestjs/swagger";

@ApiTags('UserModule')
@Controller('user')
export class UserController{
    constructor(private readonly userService: UserService) {}

    @Get()
    findAll() {
        return this.userService.findAll()
    }

    @Patch(':id')
    @UsePipes(new ValidationPipe())
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