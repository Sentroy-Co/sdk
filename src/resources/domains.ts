import { HttpClient } from '../http';
import type {
  ApiResponse,
  Domain,
  DomainWithDns,
  DnsRecord,
  DomainVerification,
  BimiConfig,
  CreateDomainParams,
  PaginationParams,
} from '../types';

export class Domains {
  constructor(private http: HttpClient) {}

  async create(params: CreateDomainParams): Promise<ApiResponse<DomainWithDns>> {
    return this.http.post<DomainWithDns>('/domains', params);
  }

  async list(params?: PaginationParams): Promise<ApiResponse<Domain[]>> {
    return this.http.get<Domain[]>('/domains', params);
  }

  async get(id: string): Promise<ApiResponse<Domain>> {
    return this.http.get<Domain>(`/domains/${id}`);
  }

  async verify(id: string): Promise<ApiResponse<Domain & { verification: DomainVerification }>> {
    return this.http.post<Domain & { verification: DomainVerification }>(`/domains/${id}/verify`);
  }

  async delete(id: string): Promise<ApiResponse<{ message: string }>> {
    return this.http.delete<{ message: string }>(`/domains/${id}`);
  }

  async getDnsRecords(id: string): Promise<ApiResponse<DnsRecord[]>> {
    return this.http.get<DnsRecord[]>(`/domains/${id}/dns-records`);
  }

  // ── BIMI ──

  async getBimi(id: string): Promise<ApiResponse<BimiConfig>> {
    return this.http.get<BimiConfig>(`/domains/${id}/bimi`);
  }

  async updateBimi(id: string, params: { logoUrl: string | null; vmcUrl?: string | null }): Promise<ApiResponse<BimiConfig>> {
    return this.http.put<BimiConfig>(`/domains/${id}/bimi`, params);
  }

  async verifyBimi(id: string): Promise<ApiResponse<BimiConfig & { bimiRecord: string | null }>> {
    return this.http.post<BimiConfig & { bimiRecord: string | null }>(`/domains/${id}/bimi/verify`);
  }
}
