import {
  ArgumentsHost,
  BadRequestException,
  Catch,
  ExceptionFilter,
  HttpException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { LogService } from '../logger/log.service';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(private readonly logger: LogService) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status = exception.getStatus();
    let message = exception.message;
    const cause = exception.cause;

    if (exception instanceof BadRequestException) {
      const validationErrors = exception.getResponse()['message'];
      if (validationErrors) {
        message = validationErrors;
      }
    }

    this.logger.error(`${request.method} ${request.originalUrl} ${status} ${message} `);

    response.status(status).json({
      statusCode: status,
      message: message,
      timestamp: new Date().toISOString(),
      path: request.url,
      cause: cause,
    });
  }
}
