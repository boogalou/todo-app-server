import { Request } from 'express';

export interface UserDetails {
  id: number;
  username: string;
  email: string;
}

export interface ExtRequest extends Request {
  user: UserDetails | null;
}
