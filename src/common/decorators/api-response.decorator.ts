import { applyDecorators, Type } from '@nestjs/common';
import { ApiExtraModels, ApiResponse, getSchemaPath } from '@nestjs/swagger';

export function ApiStandardResponse<TModel extends Type<any>>(
  status: number,
  description: string,
  model: TModel,
) {
  return applyDecorators(
    ApiExtraModels(model),
    ApiResponse({
      status,
      description,
      schema: {
        properties: {
          success: { type: 'boolean', example: true },
          statusCode: { type: 'number', example: status },
          timestamp: { type: 'string', example: '2026-04-11T18:56:18.000Z' },
          path: { type: 'string', example: '/api/v1/resource' },             
          data: { $ref: getSchemaPath(model) },
        },
      },
    }),
  );
}

export function ApiStandardErrorResponse(status: number, description: string, errorCode: string, exampleMessage: string) {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      schema: {
        example: {
          success: false,
          statusCode: status,
          timestamp: '2026-04-11T18:56:18.000Z',
          path: '/api/v1/resource',             
          error: {
            code: errorCode,
            message: exampleMessage,
          },
        },
      },
    }),
  );
}