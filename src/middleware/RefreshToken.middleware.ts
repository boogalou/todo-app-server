import { ForbiddenException, Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtService) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies['refreshToken'];

    if (!token) {
      throw new ForbiddenException('Access denied. Token not found.');
    }

    try {
      this.jwtService.validateRefreshToken(token);
      next();
    } catch (err) {
      res.clearCookie('refreshToken');
      throw new ForbiddenException('Access denied. Token expired');
    }
  }
}
