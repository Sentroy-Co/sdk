import { HttpClient } from '../http';
import type {
  ApiResponse,
  ApiKey,
  ApiKeyWithSecret,
  CreateApiKeyParams,
} from '../types';

export class ApiKeys {
  constructor(private http: HttpClient) {}

  async create(params: CreateApiKeyParams): Promise<ApiResponse<ApiKeyWithSecret>> {
    return this.http.post<ApiKeyWithSecret>('/api-keys', params);
  }

  async list(): Promise<ApiResponse<ApiKey[]>> {
    return this.http.get<ApiKey[]>('/api-keys');
  }

  /** İstek yapan key'in kendi bilgisi. Master key'i tespit etmek için kullanılır. */
  async me(): Promise<ApiResponse<ApiKey>> {
    return this.http.get<ApiKey>('/api-keys/me');
  }

  async revoke(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.http.delete<{ message: string }>(`/api-keys/${id}`);
  }
}
