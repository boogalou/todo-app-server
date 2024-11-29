import { Request } from 'express';

export interface UserDetails {
  id: number;
  username: string;
  email: string;
}

export enum JwtToken {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  URL_TOKEN = 'URL_TOKEN',
}

export interface ExtRequest extends Request {
  user: UserDetails | null;
}
