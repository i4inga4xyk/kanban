import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, MinLength } from "class-validator";

export class CreateUserDto {
    @ApiProperty({example: "example@mail.com"})
    @IsEmail()
    email: string;

    @ApiProperty({example:  "Vasya"})
    @IsNotEmpty()
    username: string;

    @ApiProperty({example: "123456"})
    @MinLength(6, {'message': 'Password must be more than 6 characters.'})
    password: string;
}