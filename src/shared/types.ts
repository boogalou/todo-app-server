import { Request } from 'express';
import { UserEntity } from '../user/entity/User.entity';

export interface ExtRequest extends Request {
  user?: UserEntity;
}
