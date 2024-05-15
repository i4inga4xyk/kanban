import { PickType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class ResponseUserInfoDto extends PickType(User, [
  'id',
  'email',
  'username',
]) {}
