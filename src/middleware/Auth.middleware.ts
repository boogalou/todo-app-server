import { Injectable, NestMiddleware } from '@nestjs/common';
import { JwtService } from '../jwt/jwt.service';
import { Response, NextFunction } from 'express';
import { LogService } from '../logger/log.service';
import { UserRepository } from '../user/user.repository';
import { ExtRequest } from '../shared/types';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  private logger: LogService;
  constructor(
    private readonly jwtService: JwtService,
    private readonly userRepository: UserRepository,
    private readonly loggerService: LogService,
  ) {
    this.logger = this.loggerService;
  }

  async use(req: ExtRequest, res: Response, next: NextFunction) {
    try {
      const authHeaders = req.headers.authorization;
      if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
        req.user = null;
        return next();
      }

      const token = req.headers.authorization.split(' ')[1];
      const tokenPayload = await this.jwtService.validateToken(token, 'accessToken');
      const userId = Number(tokenPayload.sub);
      req.user = await this.userRepository.findById(Number(userId));
      next();
    } catch (err) {
      this.logger.error(`AuthMiddleware: Authorized Error: ${err}`);
      req.user = null;
      next();
    }
  }
}
