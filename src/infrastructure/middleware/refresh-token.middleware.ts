import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExtRequest } from '../../shared/types';
import { Jwt_Service } from '../../shared/tokens';
import { JwtService } from '../../application/services/jwt.service';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(
    @Inject(Jwt_Service)
    private readonly jwtService: JwtService,
  ) {}

  async use(req: ExtRequest, res: Response, next: NextFunction) {
    const token = req.cookies['refreshToken'];

    if (!token) {
      return res.status(403).json({ message: 'Access denied. Token not found.' });
    }

    try {
      await this.jwtService.validateToken(token, 'refreshToken');
      next();
    } catch (err) {
      res.clearCookie('refreshToken');
      return res.status(403).json({ message: 'Access denied. Token expired.' });
    }
  }
}
