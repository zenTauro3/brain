import { CallHandler, ExecutionContext, Injectable, NestInterceptor, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Request, Response } from 'express';
import { ApiSuccessResponse } from '../interfaces/api-response.interface';

@Injectable()
export class ResponseInterceptor<T> implements NestInterceptor<T, ApiSuccessResponse<T>> {
  intercept(context: ExecutionContext, next: CallHandler<T>): Observable<ApiSuccessResponse<T>> {
    const ctx = context.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();

    const ignoredPaths = ['/docs', '/health', '/metrics'];
    if (ignoredPaths.some((path) => request.url.includes(path))) {
      return next.handle() as any; 
    }

    return next.handle().pipe(
      map((data: any) => {
        const isPaginated = data && typeof data === 'object' && 'meta' in data && 'data' in data;

        const wrappedResponse: ApiSuccessResponse<T> = {
          success: true,
          statusCode: response.statusCode ?? HttpStatus.OK,
          timestamp: new Date().toISOString(),
          path: request.url,
          
          data: isPaginated ? data.data : (data ?? null),
          ...(isPaginated && { meta: data.meta }),
        };

        return wrappedResponse;
      }),
    );
  }
}