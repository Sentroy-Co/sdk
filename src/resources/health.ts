import { HttpClient } from '../http';
import type { ApiResponse, HealthStatus, QueueHealth } from '../types';

export class Health {
  constructor(private http: HttpClient) {}

  async check(): Promise<ApiResponse<HealthStatus>> {
    return this.http.get<HealthStatus>('/health');
  }

  async queue(): Promise<ApiResponse<QueueHealth>> {
    return this.http.get<QueueHealth>('/health/queue');
  }
}
