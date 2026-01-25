import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Response } from 'express';
import { ApiResponse } from '../dto/api-response.dto';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      message =
        Array.isArray(exceptionResponse?.message)
          ? exceptionResponse.message.join(', ')
          : exceptionResponse?.message || exception.message;

      code = HttpStatus[statusCode];
    }

    const body: ApiResponse<null> = {
      success: false,
      statusCode,
      error: {
        code,
        message,
      },
    };

    response.status(statusCode).json(body);
  }
}
