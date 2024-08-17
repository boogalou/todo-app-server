import { Request } from 'express';
import { UserEntity } from '../user/entity/User.entity';

export type AuthResponse = {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  refreshToken?: string;
};

export interface ExtRequest extends Request {
  user?: UserEntity;
}
