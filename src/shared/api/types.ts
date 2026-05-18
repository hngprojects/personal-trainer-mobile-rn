export interface ApiResponse<T> {
  data: T;
  message?: string;
}

// Standard backend envelope shared across every endpoint.
// `data` carries the payload; `meta` is optional pagination/cursor info.
export interface ApiEnvelope<T> {
  status: string;
  message: string;
  code: string;
  data: T;
  meta?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
    public readonly code?: string,
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
