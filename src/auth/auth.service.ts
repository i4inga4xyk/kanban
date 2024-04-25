import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UserService } from 'src/user/user.service';
import * as argon2 from 'argon2'
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';
import { CreateUserDto } from 'src/user/dto/create-user.dto';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UserService,
    private readonly jwtService: JwtService,
    ) {}
  
  async register(userDto: CreateUserDto) {

    const existsEmail = await this.userService.findOneByEmail(userDto.email);
    if (existsEmail) throw new BadRequestException('This email has already been registered!');

    const existsUsername = await this.userService.findOneByUsername(userDto.username);
    if (existsUsername) throw new BadRequestException('This username is taken!');

    return await this.userService.create(userDto);
  }  

  async validateUser(email: string, pass: string): Promise<any> {
    const user = await this.userService.findOneByEmail(email);
    if (!user) {
      throw new UnauthorizedException('This email is not registered!');
    }

    const passwordMatch = await argon2.verify(user.password_hash, pass)
    if (user && passwordMatch) {
      return user;
    }
    throw new UnauthorizedException('Incorrect password!');
  }
  
  async login(user: IUser) {
    const {id, username, email} = user
    const payload = { id: user.id, email: user.email, username: user.username };
    return {
      id,
      username,
      email,
      token: this.jwtService.sign(payload),
    };
  }
}
