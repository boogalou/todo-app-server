import {
  ForbiddenException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Response } from 'express';

import { JwtService } from '../../application/services/jwt.service';
import {
  Formatter_Service,
  Jwt_Service,
  Logger_Service,
  User_Details_Service,
} from '../../shared/tokens';
import { UserDetailsService } from '../services/user-details.service';
import { LoggerService } from '../../application/services/logger.service';
import { ExtRequest, JwtToken } from '../../shared/types';
import { ExceptionFormatterService } from '../services/exception-formatter.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(
    @Inject(Jwt_Service)
    private readonly jwtService: JwtService,
    @Inject(User_Details_Service)
    private readonly userDetails: UserDetailsService,
    @Inject(Logger_Service)
    private readonly logger: LoggerService,
    @Inject(Formatter_Service)
    private readonly exceptionFormatter: ExceptionFormatterService,
  ) {}

  async use(request: ExtRequest, response: Response, next: NextFunction) {
    try {
      const authHeaders = request.headers.authorization;
      if (!authHeaders || !authHeaders.startsWith('Bearer ')) {
        request.user = null;
        this.logger.info('AuthMiddleware: Authorization token missing in request header');
        const formatedResponse = this.exceptionFormatter.formatExceptionResponse(
          new UnauthorizedException({
            message: 'Authorization token missing in request header',
            error_code: 'MISSING_TOKEN',
          }),
          request,
        );
        response.status(401).json(formatedResponse);
        return;
      }

      const token = request.headers.authorization.split(' ')[1];

      const tokenPayload = await this.jwtService.validateToken(token, JwtToken.ACCESS_TOKEN);
      if (!tokenPayload) {
        request.user = null;
        this.logger.warn('AuthMiddleware: Invalid or expired authorization token');
        const formatedResponse = this.exceptionFormatter.formatExceptionResponse(
          new UnauthorizedException({
            message: 'Invalid or expired authorization token',
            error_code: 'INVALID_OR_EXPIRED_TOKEN',
          }),
          request,
        );
        response.status(401).json(formatedResponse);
        return;
      }

      const userId = Number(tokenPayload.sub);
      const userDetails = await this.userDetails.getById(userId);
      if (!userDetails) {
        request.user = null;
        this.logger.warn(
          `AuthMiddleware: User not found for the provided token's user ID ${userId}`,
        );
        const formatedResponse = this.exceptionFormatter.formatExceptionResponse(
          new ForbiddenException({
            message: 'User authentication failed. User data not found in the database',
            error_code: 'USER_NOT_FOUND',
          }),
          request,
        );
        response.status(403).json(formatedResponse);
        return;
      }

      request.user = userDetails;
      next();
    } catch (err) {
      request.user = null;
      this.logger.error(`AuthMiddleware: Authorized Error: ${err.message}`, err.stack);
      const formatedResponse = this.exceptionFormatter.formatExceptionResponse(
        new InternalServerErrorException({
          message: 'Unexpected server error occurred during authentication',
          error_code: 'SERVER_ERROR_AUTHENTICATION',
        }),
        request,
      );
      response.status(500).json(formatedResponse);
      return;
    }
  }
}
