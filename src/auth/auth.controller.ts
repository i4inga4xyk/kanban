import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { LocalAuthGuard } from './guards/local-auth.guard';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { CreateUserDto } from 'src/user/dto/create-user.dto';
import { ResponseUserInfoDto } from 'src/user/dto/response-user-info.dto';
import {
  ApiBearerAuth,
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseUserFullDto } from 'src/user/dto/response-user-full.dto';
import { ResponseUserLoginDto } from 'src/user/dto/response-user-login.dto';

@ApiTags('AuthModule')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ description: 'Creates a new user.' })
  @ApiCreatedResponse({
    description: 'Registration completed!',
    type: ResponseUserFullDto,
  })
  @Post('register')
  @UsePipes(new ValidationPipe())
  create(@Body() userDto: CreateUserDto) {
    return this.authService.register(userDto);
  }

  @ApiOperation({ description: 'Log in as existing user.' })
  @ApiCreatedResponse({
    description: 'Login successful!',
    type: ResponseUserLoginDto,
  })
  @Post('login')
  @UseGuards(LocalAuthGuard)
  async login(@Request() req) {
    return this.authService.login(req.user);
  }

  @ApiOperation({ description: 'Returns data about logged in user.' })
  @ApiOkResponse({
    description: 'User info',
    type: ResponseUserInfoDto,
  })
  @ApiBearerAuth()
  @UseGuards(JwtAuthGuard)
  @Get('me')
  getProfile(@Request() req) {
    return req.user;
  }
}
