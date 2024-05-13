import { Body, Controller, Delete, Get, Param, Patch, UsePipes, ValidationPipe } from "@nestjs/common";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto/update-user.dto";
import { ApiOkResponse, ApiOperation, ApiParam, ApiTags, OmitType } from "@nestjs/swagger";
import { User } from "./entities/user.entity";

@ApiTags('UserModule')
@Controller('user')
export class UserController{
    constructor(private readonly userService: UserService) {}

    @ApiOperation({description: "Returns all registered users."})
    @ApiOkResponse({
        description: "All users",
        type: [class AllUsers extends OmitType(User, ['projects', 'tasks']) {}]
    })
    @Get()
    findAll() {
        return this.userService.findAll()
    }

    @ApiOperation({description: "Updates user data by id."})
    @ApiOkResponse({description: "User successfully updated!"})
    @ApiParam({name: "id", description: "User ID"})
    @Patch(':id')
    @UsePipes(new ValidationPipe())
    update(
        @Param('id') id: number,
        @Body() updateUserDto: UpdateUserDto
    ){
        return this.userService.update(id, updateUserDto)
    }

    @ApiOperation({description: "Deletes a user by id."})
    @ApiOkResponse({description: "User successfully deleted!"})
    @ApiParam({name: "id", description: "User ID"})
    @Delete(':id')
    remove(@Param('id') id: number) {
    return this.userService.remove(id);
  }
}