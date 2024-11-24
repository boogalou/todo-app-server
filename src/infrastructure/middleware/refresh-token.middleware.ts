import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtServiceImpl } from '../services/impl/jwt.service.impl';
import { NextFunction, Response } from 'express';
import { ExtRequest } from '../../shared/types';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(private readonly jwtService: JwtServiceImpl) {}

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
