const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "https://fixitnow-server.onrender.com";

interface ApiErrorSource {
  path: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  errorSources?: ApiErrorSource[];
  constructor(
    message: string,
    status: number,
    errorSources?: ApiErrorSource[]
  ) {
    super(message);
    this.status = status;
    this.errorSources = errorSources;
  }
}

interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: unknown;
  errorSources?: ApiErrorSource[];
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  allowRetry = true
): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });

  if (res.status === 401 && allowRetry) {
    const refreshed = await fetch(`${API_BASE_URL}/api/auth/refresh-token`, {
      method: "POST",
      credentials: "include",
    });
    if (refreshed.ok) return request<T>(path, options, false);
  }

  const json = (await res.json().catch(() => ({
    success: false,
    message: "Something went wrong. Please try again.",
    data: null,
  }))) as ApiEnvelope<T>;

  if (!res.ok || !json.success) {
    throw new ApiError(json.message, res.status, json.errorSources);
  }

  return json.data;
}

export const api = {
  get: <T>(path: string) => request<T>(path, { method: "GET" }),
  post: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "POST",
      body: body ? JSON.stringify(body) : undefined,
    }),
  put: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PUT",
      body: body ? JSON.stringify(body) : undefined,
    }),
  patch: <T>(path: string, body?: unknown) =>
    request<T>(path, {
      method: "PATCH",
      body: body ? JSON.stringify(body) : undefined,
    }),
  delete: <T>(path: string) => request<T>(path, { method: "DELETE" }),
};
