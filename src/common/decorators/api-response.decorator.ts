import { applyDecorators } from '@nestjs/common';
import { ApiResponse } from '@nestjs/swagger';

export function ApiStandardResponse(status: number, description: string, dataExample: any) {
  return applyDecorators(
    ApiResponse({
      status,
      description,
      schema: {
        example: {
          success: true,
          statusCode: status,
          data: dataExample,
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
          error: {
            code: errorCode,
            message: exampleMessage,
          },
        },
      },
    }),
  );
}