import { Request } from 'express';

export type UserDetails = {
  id: number;
  username: string;
  email: string;
};

export enum JwtToken {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  URL_TOKEN = 'URL_TOKEN',
}

export interface ExtRequest extends Request {
  user: UserDetails | null;
}

export type ExceptionResponse = {
  statusCode: number;
  message: string;
  errorCode: string;
  timestamp: string;
  path: string;
};
