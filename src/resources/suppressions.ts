import { HttpClient } from '../http';
import type {
  ApiResponse,
  Suppression,
  AddSuppressionParams,
  SuppressionListParams,
} from '../types';

export class Suppressions {
  constructor(private http: HttpClient) {}

  async list(params?: SuppressionListParams): Promise<ApiResponse<Suppression[]>> {
    return this.http.get<Suppression[]>('/suppressions', params as any);
  }

  async add(params: AddSuppressionParams): Promise<ApiResponse<Suppression>> {
    return this.http.post<Suppression>('/suppressions', params);
  }

  async remove(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.http.delete<{ message: string }>(`/suppressions/${id}`);
  }

  async check(email: string, domainId: string): Promise<ApiResponse<{ suppressed: boolean; suppression?: Suppression }>> {
    return this.http.get<{ suppressed: boolean; suppression?: Suppression }>('/suppressions/check', { email, domainId });
  }
}
