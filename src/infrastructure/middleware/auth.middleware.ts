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
import { JwtPayload } from 'jsonwebtoken';

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

  public async use(request: ExtRequest, response: Response, next: NextFunction) {
    try {
      const authHeader = request.headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        this.logger.info('AuthMiddleware: Authorization token missing in request header');
        request.user = null;
        return next();
      }

      const token = authHeader.split(' ')[1];
      let tokenPayload: string | JwtPayload;
      try {
        tokenPayload = await this.jwtService.validateToken(token, JwtToken.ACCESS_TOKEN);
      } catch (error) {
        this.logger.warn('AuthMiddleware: Invalid or expired authorization token');
        return this.handleError(
          response,
          401,
          'Invalid or expired authorization token',
          'INVALID_OR_EXPIRED_TOKEN',
          request,
        );
      }

      const userId = Number(tokenPayload.sub);
      const userDetails = await this.userDetails.getById(userId);
      if (!userDetails) {
        this.logger.warn(
          `AuthMiddleware: User not found for the provided token's user ID ${userId}`,
        );
        return this.handleError(
          response,
          403,
          'User authentication failed. User data not found in the database',
          'USER_NOT_FOUND',
          request,
        );
      }

      request.user = userDetails;
      next();
    } catch (err) {
      this.logger.error(`AuthMiddleware: Authorized Error: ${err.message}`, err.stack);
      return this.handleError(
        response,
        500,
        'Unexpected server error occurred during authentication',
        'SERVER_ERROR_AUTHENTICATION',
        request,
      );
    }
  }

  private handleError(
    response: Response,
    statusCode: number,
    message: string,
    errorCode: string,
    request: ExtRequest,
  ) {
    const formatedResponse = this.exceptionFormatter.formatExceptionResponse(
      new (statusCode === 401 ? UnauthorizedException : ForbiddenException)({
        message,
        error_code: errorCode,
      }),
      request,
    );
    response.status(statusCode).json(formatedResponse);
  }
}
