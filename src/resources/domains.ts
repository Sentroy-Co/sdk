import { HttpClient } from '../http';
import type {
  ApiResponse,
  Domain,
  DomainWithDns,
  DnsRecord,
  DomainVerification,
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
}
