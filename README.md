curl.exe -X POST http://localhost:3000/audio/transcribe -F "file=audio.m4a"

# Client Request
export async function apiRequest<T>(promise: Promise<any>): Promise<T> {
  try {
    const { data } = await promise;

    if (!data.success) {
      throw data;
    }

    return data.data;
  } catch (error: any) {
    const apiError = error.response?.data;

    throw {
      code: apiError?.error?.code ?? 'NETWORK_ERROR',
      message: apiError?.error?.message ?? 'Unexpected error',
    };
  }
}
