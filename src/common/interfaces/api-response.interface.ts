export interface ApiBaseResponse {
  statusCode: number;
  timestamp: string;
  path: string;
}

export interface ApiSuccessResponse<T> extends ApiBaseResponse {
  success: true;
  data: T;
  meta?: any; 
}

export interface ApiErrorResponse extends ApiBaseResponse {
  success: false;
  error: {
    code: string;
    message: string;
  };
}

export type ApiResponse<T> = ApiSuccessResponse<T> | ApiErrorResponse;