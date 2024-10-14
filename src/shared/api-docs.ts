import {
  ApiBody,
  ApiBodyOptions,
  ApiOperation,
  ApiOperationOptions,
  ApiParam,
  ApiParamOptions,
  ApiResponse,
  ApiResponseOptions,
} from '@nestjs/swagger';
import { applyDecorators } from '@nestjs/common';

interface ApiDocsOptions {
  operation?: ApiOperationOptions;
  params?: ApiParamOptions[];
  responses?: ApiResponseOptions[];
  body?: ApiBodyOptions;
}

export function ApiDocs(options: ApiDocsOptions) {
  return applyDecorators(
    ...(options.operation ? [ApiOperation(options.operation)] : []),
    ...(options.params ? options.params.map((param) => ApiParam(param)) : []),
    ...(options.body ? [ApiBody(options.body)] : []),
    ...(options.responses ? options.responses.map((response) => ApiResponse(response)) : []),
  );
}
