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

  // ── Transfer & catch-all ──

  /**
   * Domain ownership'ini başka bir company'e devreder. DKIM key/public key
   * dokunulmaz, sadece domain'in `companyId`'si değişir → caller'ın API
   * key'i transfer sonrası bu domain'i artık göremez (yeni sahibinin key'i
   * görür). DNS records'ında değişiklik yok.
   *
   * Caller şu anki sahip olmak zorunda (domain scope filter); admin master
   * key her durumda transfer edebilir.
   */
  async transfer(id: string, params: { companyId: string }): Promise<ApiResponse<Domain>> {
    return this.http.patch<Domain>(`/domains/${id}`, { companyId: params.companyId });
  }

  /**
   * Catch-all mailbox set'ler veya kaldırır. `mailboxEmail` null ise catch-all
   * disable; non-null ise o adres bu domain'in mevcut bir mailbox'ı olmalı
   * (backend create flow'unda check yok ama mail gelene kadar routing kuralı
   * yazılmış olur — kullanıcı ayrıca `mailboxes.create` ile anchor'ı yaratmalı
   * önce).
   *
   * Backend Postfix virtual_alias_maps'i regenerate eder; aynı domain'de
   * specific mailbox + catch-all aynı anda var olabilir (specific kazanır).
   */
  async setCatchAll(id: string, params: { mailboxEmail: string | null }): Promise<ApiResponse<Domain>> {
    return this.http.patch<Domain>(`/domains/${id}`, {
      catchAllMailboxEmail: params.mailboxEmail,
    });
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
