import { HttpClient } from '../http';
import type {
  ApiResponse,
  StatisticsOverview,
  DailyStats,
  DomainStats,
} from '../types';

export class Statistics {
  constructor(private http: HttpClient) {}

  async overview(params?: { domainId?: string; from?: string; to?: string }): Promise<ApiResponse<StatisticsOverview>> {
    return this.http.get<StatisticsOverview>('/statistics/overview', params);
  }

  async daily(params?: { domainId?: string; days?: number }): Promise<ApiResponse<DailyStats[]>> {
    return this.http.get<DailyStats[]>('/statistics/daily', params);
  }

  async domains(): Promise<ApiResponse<DomainStats[]>> {
    return this.http.get<DomainStats[]>('/statistics/domains');
  }
}
