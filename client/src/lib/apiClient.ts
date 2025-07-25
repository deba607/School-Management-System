import { getToken } from "@/utils/auth";

interface RequestOptions extends RequestInit {
  headers?: Record<string, string>;
  body?: any;
}

export async function apiClient<T = any>(
  endpoint: string,
  { headers, body, ...customConfig }: RequestOptions = {}
): Promise<T> {
  const token = getToken();
  
  const config: RequestInit = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      'Content-Type': body ? 'application/json' : '',
      ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`/api${endpoint}`, config);

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(
      error.message || 'An error occurred while making the request.'
    );
  }

  return response.json();
}
