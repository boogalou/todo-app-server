import { ForbiddenException, Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { ExtRequest, JwtToken } from '../../shared/types';
import { Jwt_Service } from '../../shared/tokens';
import { JwtService } from '../../application/services/jwt.service';

@Injectable()
export class RefreshTokenMiddleware implements NestMiddleware {
  constructor(
    @Inject(Jwt_Service)
    private readonly jwtService: JwtService,
  ) {}

  async use(req: ExtRequest, res: Response, next: NextFunction) {
    const token = req.cookies['refresh_token'];
    if (!token) {
      throw new ForbiddenException('Access denied. Token not found.');
    }

    try {
      await this.jwtService.validateToken(token, JwtToken.REFRESH_TOKEN);
      next();
    } catch (err) {
      res.clearCookie('refresh_token');
      throw new ForbiddenException('Access denied. Token expired.');
    }
  }
}
