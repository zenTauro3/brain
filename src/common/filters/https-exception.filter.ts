import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus, Logger } from '@nestjs/common';
import { Request, Response } from 'express';
import { ApiErrorResponse } from '../interfaces/api-response.interface';

@Catch()
export class GlobalHttpExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(GlobalHttpExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    let statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';
    let code = 'INTERNAL_SERVER_ERROR';

    if (exception instanceof HttpException) {
      statusCode = exception.getStatus();
      const exceptionResponse = exception.getResponse() as any;

      message = Array.isArray(exceptionResponse?.message)
        ? exceptionResponse.message.join(', ')
        : exceptionResponse?.message || exception.message;

      code = HttpStatus[statusCode] ?? 'UNKNOWN_ERROR';
    } else {
      this.logger.error(`🔥 ERROR NO CONTROLADO en ${request.url}:`, exception);
    }

    const errorResponse: ApiErrorResponse = {
      success: false,
      statusCode,
      timestamp: new Date().toISOString(),
      path: request.url,
      error: {
        code,
        message,
      },
    };

    response.status(statusCode).json(errorResponse);
  }
}