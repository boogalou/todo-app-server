import { JwtPayload } from 'jsonwebtoken';
import { JwtToken } from '../../shared/types';

export interface JwtService {
  createToken(id: number, email: string, tokenType: JwtToken): string;

  validateToken(token: string, tokenType: JwtToken): string | JwtPayload;
}
