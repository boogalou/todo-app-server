import { Inject, Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { JwtService } from '../../application/services/jwt.service';
import { Jwt_Service, Logger_Service, User_Details_Service } from '../../shared/tokens';
import { UserDetailsService } from '../services/user-details.service';
import { LoggerService } from '../../application/services/logger.service';
import { ExtRequest, JwtToken } from '../../shared/types';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(Jwt_Service)
    private readonly jwtService: JwtService,
    @Inject(User_Details_Service)
    private readonly userDetails: UserDetailsService,
    @Inject(Logger_Service)
    private readonly logger: LoggerService,
  ) {}

  async use(req: ExtRequest, res: Response, next: NextFunction) {
    try {
      const authHeaders = req.headers.authorization;
      if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
        req.user = null;
        this.logger.info('AuthMiddleware: No token provided');
        return next();
      }

      const token = req.headers.authorization.split(' ')[1];

      const tokenPayload = await this.jwtService.validateToken(token, JwtToken.ACCESS_TOKEN);
      if (!tokenPayload) {
        req.user = null;
        this.logger.warn('AuthMiddleware: Invalid token');
        return next();
      }

      const userId = Number(tokenPayload.sub);
      const userDetails = await this.userDetails.getById(userId);
      if (!userDetails) {
        req.user = null;
        this.logger.warn(`AuthMiddleware: User not found for ID ${userId}`);
        return next();
      }

      req.user = userDetails;
      next();
    } catch (err) {
      this.logger.error(`AuthMiddleware: Authorized Error: ${err.message}`, err.stack);
      req.user = null;
      next();
    }
  }
}
