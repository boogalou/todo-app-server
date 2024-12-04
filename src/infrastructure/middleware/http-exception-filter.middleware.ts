import { ArgumentsHost, Catch, ExceptionFilter, HttpException, Inject } from '@nestjs/common';
import { LoggerService } from '../../application/services/logger.service';
import { Formatter_Service, Logger_Service } from '../../shared/tokens';
import { ExceptionFormatterService } from '../services/exception-formatter.service';
import { ExtRequest } from '../../shared/types';

@Catch(HttpException)
export class HttpExceptionFilter implements ExceptionFilter {
  constructor(
    @Inject(Logger_Service)
    private readonly logger: LoggerService,
    @Inject(Formatter_Service)
    private readonly exceptionFormatterService: ExceptionFormatterService,
  ) {}

  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse();
    const request = ctx.getRequest() as ExtRequest;

    const formattedResponse = this.exceptionFormatterService.formatExceptionResponse(
      exception,
      request,
    );

    this.logger.error(
      `${request.method} ${request.originalUrl} ${formattedResponse.statusCode} ${formattedResponse.message} `,
    );

    response.status(formattedResponse.statusCode).json(formattedResponse);
  }
}
