export type ApiSuccessResponse<T> = {
  success: true;
  statusCode: number;
  data: T;
};

export type ApiErrorResponse = {
  success: false;
  statusCode: number;
  error: {
    code: string;
    message: string;
  };
};

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;
