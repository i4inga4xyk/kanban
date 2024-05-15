import { ApiProperty, PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class ResponseUserLoginDto extends PickType(User, [
  'id',
  'email',
  'username',
]) {
  @ApiProperty({ example: 'JSON Web Token' })
  token: string;
}
