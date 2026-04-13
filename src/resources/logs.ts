import { HttpClient } from '../http';
import type { ApiResponse, MailLog, LogListParams } from '../types';

export class Logs {
  constructor(private http: HttpClient) {}

  async list(params?: LogListParams): Promise<ApiResponse<MailLog[]>> {
    return this.http.get<MailLog[]>('/logs', params as any);
  }

  async get(id: string): Promise<ApiResponse<MailLog>> {
    return this.http.get<MailLog>(`/logs/${id}`);
  }
}
