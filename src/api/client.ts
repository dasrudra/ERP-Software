const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

export class ApiError extends Error {
  status: number;
  payload?: unknown;

  constructor(message: string, status: number, payload?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

type RequestOptions = RequestInit & {
  token?: string;
};

type JsonBody = Record<string, unknown> | Array<unknown>;

function buildUrl(path: string) {
  if (path.startsWith("http")) {
    return path;
  }

  return `${API_BASE_URL}${path}`;
}

async function parseResponse(response: Response) {
  const contentType = response.headers.get("content-type");
  const isJson = contentType?.includes("application/json");

  if (response.status === 204) {
    return null;
  }

  return isJson ? response.json() : response.text();
}

export async function apiClient<T>(
  path: string,
  options: RequestOptions = {},
): Promise<T> {
  const headers = new Headers(options.headers);

  const isFormData = options.body instanceof FormData;

  if (!headers.has("Content-Type") && !isFormData) {
    headers.set("Content-Type", "application/json");
  }

  if (options.token) {
    headers.set("Authorization", `Bearer ${options.token}`);
  }

  const response = await fetch(buildUrl(path), {
    ...options,
    headers,
  });

  const payload = await parseResponse(response);

  if (!response.ok) {
    throw new ApiError(
      `API request failed: ${response.status}`,
      response.status,
      payload,
    );
  }

  return payload as T;
}

export const api = {
  get<T>(path: string, token?: string) {
    return apiClient<T>(path, {
      method: "GET",
      token,
    });
  },

  post<T>(path: string, body?: JsonBody | FormData, token?: string) {
    return apiClient<T>(path, {
      method: "POST",
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
      token,
    });
  },

  patch<T>(path: string, body?: JsonBody | FormData, token?: string) {
    return apiClient<T>(path, {
      method: "PATCH",
      body: body instanceof FormData ? body : JSON.stringify(body ?? {}),
      token,
    });
  },

  delete<T>(path: string, token?: string) {
    return apiClient<T>(path, {
      method: "DELETE",
      token,
    });
  },
};
