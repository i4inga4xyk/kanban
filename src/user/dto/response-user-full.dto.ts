import { OmitType } from '@nestjs/swagger';
import { User } from '../entities/user.entity';

export class ResponseUserFullDto extends OmitType(User, [
  'projects',
  'tasks',
]) {}
