import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { UserService } from '../user/user.service';
import { NextFunction } from 'express';
import { RequestExt } from '../types';
import { JwtPayload } from 'jsonwebtoken';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: RequestExt, res: Response, next: NextFunction) {
    try {
      const authHeaders = req.headers.authorization;
      if (!authHeaders) {
        req.user = null;
        return next();
      }

      const token = req.headers.authorization.split(' ')[1];
      const tokenPayload = this.jwtService.validateAccessToken(token) as JwtPayload;
      req.user = await this.userService.findById(Number(tokenPayload.sub));
      next();
    } catch (err) {
      req.user = null;
      next();
    }
  }
}
