import { HttpException } from '@nestjs/common';
import { ExceptionResponse, ExtRequest } from '../../shared/types';

export interface ExceptionFormatterService {
  formatExceptionResponse(exception: HttpException, request: ExtRequest): ExceptionResponse;
}
