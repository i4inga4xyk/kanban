import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty()
    @IsEmail()
    email: string;

    @ApiProperty()
    @IsNotEmpty()
    username: string;

    @ApiProperty()
    @MinLength(6, {'message': 'Password must be more than 6 characters.'})
    password: string;
}