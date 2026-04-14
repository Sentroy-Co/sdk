import type { ApiResponse, SentroyConfig } from './types';

export class SentroyHttpError extends Error {
  constructor(
    public statusCode: number,
    public body: any,
    message?: string
  ) {
    super(message || `HTTP ${statusCode}: ${body?.error || 'Unknown error'}`);
    this.name = 'SentroyHttpError';
  }
}

export class HttpClient {
  private baseUrl: string;
  private apiKey: string;
  private timeout: number;

  constructor(config: SentroyConfig) {
    this.baseUrl = config.baseUrl.replace(/\/$/, '') + '/api/v1';
    this.apiKey = config.apiKey;
    this.timeout = config.timeout || 30000;
  }

  private async request<T>(
    method: string,
    path: string,
    options?: {
      body?: any;
      query?: Record<string, any>;
      rawResponse?: boolean;
    }
  ): Promise<ApiResponse<T>> {
    let url = `${this.baseUrl}${path}`;

    // Query params
    if (options?.query) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(options.query)) {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      }
      const qs = params.toString();
      if (qs) url += `?${qs}`;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const hasBody = options?.body !== undefined && options?.body !== null;
      const headers: Record<string, string> = {
        'Authorization': `Bearer ${this.apiKey}`,
        'Accept': 'application/json',
      };
      if (hasBody) {
        headers['Content-Type'] = 'application/json';
      }

      const res = await fetch(url, {
        method,
        headers,
        body: hasBody ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      if (options?.rawResponse) {
        return { data: res as any };
      }

      const json = await res.json() as ApiResponse<T>;

      if (!res.ok) {
        throw new SentroyHttpError(res.status, json);
      }

      return json;
    } finally {
      clearTimeout(timer);
    }
  }

  async get<T>(path: string, query?: Record<string, any>): Promise<ApiResponse<T>> {
    return this.request<T>('GET', path, { query });
  }

  async post<T>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, { body });
  }

  async put<T>(path: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, { body });
  }

  async delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path);
  }

  async getRaw(path: string, query?: Record<string, any>): Promise<Response> {
    let url = `${this.baseUrl}${path}`;

    if (query) {
      const params = new URLSearchParams();
      for (const [key, value] of Object.entries(query)) {
        if (value !== undefined && value !== null) {
          params.set(key, String(value));
        }
      }
      const qs = params.toString();
      if (qs) url += `?${qs}`;
    }

    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), this.timeout);

    try {
      const res = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
        },
        signal: controller.signal,
      });

      if (!res.ok) {
        const json = await res.json().catch(() => ({}));
        throw new SentroyHttpError(res.status, json);
      }

      return res;
    } finally {
      clearTimeout(timer);
    }
  }
}
