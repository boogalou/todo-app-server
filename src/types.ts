import { UserEntity } from './user/entity/UserEntity';

export type AuthResponse = {
  id: number;
  username: string;
  email: string;
  accessToken: string;
  refreshToken?: string;
};

export interface RequestUser extends Request {
  user?: UserEntity;
}

export type RequestExt = RequestUser & {
  headers: { authorization: string };
};
