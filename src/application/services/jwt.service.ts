import { TypeToken } from '../../infrastructure/services/impl/jwt.service.impl';
import { JwtPayload } from 'jsonwebtoken';

export interface JwtService {
  createToken(id: number, email: string, tokenType: TypeToken): string;

  validateToken(token: string, tokenType: TypeToken): Promise<string | JwtPayload>;
}
