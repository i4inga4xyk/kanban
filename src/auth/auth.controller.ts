import { Body, Controller, Get, Post, Request, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags, OmitType, PickType} from '@nestjs/swagger';
import { User } from 'src/user/entities/user.entity';


@ApiTags('AuthModule')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({description: "Creates a new user."})
  @ApiCreatedResponse({
    description: 'Registration completed!',
    type: class UserCreated extends OmitType(User, ['projects', 'tasks']) {}
  })
  @Post('register')
  @UsePipes(new ValidationPipe())
  create(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }
  
  @ApiOperation({description: "Log in as existing user."})
  @ApiCreatedResponse({
    description: 'Login successful!',
    schema: {
      example: {
        "id": 1,
        "username": "Vasya",
        "email": "example@mail.com",
        "token": "JSON Web Token"
      }
    }
  })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({description: "Returns data about logged in user."})
  @ApiOkResponse({
    description: "User info",
    type: class UserInfo extends PickType(User, ['id', 'email', 'username']) {}
  })
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
