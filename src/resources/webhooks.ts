import { HttpClient } from '../http';
import type {
  ApiResponse,
  Webhook,
  CreateWebhookParams,
  UpdateWebhookParams,
} from '../types';

export class Webhooks {
  constructor(private http: HttpClient) {}

  async create(params: CreateWebhookParams): Promise<ApiResponse<Webhook>> {
    return this.http.post<Webhook>('/webhooks', params);
  }

  async list(domainId?: string): Promise<ApiResponse<Webhook[]>> {
    return this.http.get<Webhook[]>('/webhooks', domainId ? { domainId } : undefined);
  }

  async get(id: string): Promise<ApiResponse<Webhook>> {
    return this.http.get<Webhook>(`/webhooks/${id}`);
  }

  async update(id: string, params: UpdateWebhookParams): Promise<ApiResponse<Webhook>> {
    return this.http.put<Webhook>(`/webhooks/${id}`, params);
  }

  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.http.delete<{ message: string }>(`/webhooks/${id}`);
  }
}
