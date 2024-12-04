import { HttpException, Injectable } from '@nestjs/common';
import { ExceptionFormatterService } from '../exception-formatter.service';
import { ExceptionResponse, ExtRequest } from '../../../shared/types';

@Injectable()
export class ExceptionFormatterServiceImpl implements ExceptionFormatterService {
  public formatExceptionResponse(exception: HttpException, request: ExtRequest): ExceptionResponse {
    const status = exception.getStatus();
    const responseDetails = exception.getResponse();
    const message =
      typeof responseDetails === 'object' && responseDetails['message']
        ? responseDetails['message']
        : exception.message;

    const errorCode =
      typeof responseDetails === 'object' && responseDetails['error_code']
        ? responseDetails['error_code']
        : null;

    return {
      statusCode: status,
      message: message,
      errorCode: errorCode,
      timestamp: new Date().toISOString(),
      path: request.url,
    };
  }
}
