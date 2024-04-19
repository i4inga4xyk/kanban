import { IsEmail, MinLength } from "class-validator";

export class CreateUserDto {
    @IsEmail()
    email: string;

    username: string;

    @MinLength(6, {'message': 'Password must be more than 6 characters.'})
    password: string;
}