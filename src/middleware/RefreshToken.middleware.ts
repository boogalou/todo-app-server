import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { NextFunction, Response } from 'express';
import { ExtRequest } from '../shared/types';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: ExtRequest, res: Response, next: NextFunction) {
    const token = req.cookies['refreshToken'];

    if (!token) {
      throw new ForbiddenException('Access denied. Token not found.');
    }

    try {
      await this.jwtService.validateToken(token, 'refreshToken');
      next();
    } catch (err) {
      res.clearCookie('refreshToken');
      throw new ForbiddenException('Access denied. Token expired');
    }
  }
}
