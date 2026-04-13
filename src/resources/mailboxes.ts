import { HttpClient } from '../http';
import type {
  ApiResponse,
  MailboxUser,
  CreateMailboxParams,
} from '../types';

export class Mailboxes {
  constructor(private http: HttpClient) {}

  async create(params: CreateMailboxParams): Promise<ApiResponse<MailboxUser>> {
    return this.http.post<MailboxUser>('/mailboxes', params);
  }

  async list(domainId?: string): Promise<ApiResponse<MailboxUser[]>> {
    return this.http.get<MailboxUser[]>('/mailboxes', domainId ? { domainId } : undefined);
  }

  async updatePassword(email: string, password: string): Promise<ApiResponse<{ message: string }>> {
    return this.http.put<{ message: string }>(
      `/mailboxes/${encodeURIComponent(email)}/password`,
      { password }
    );
  }

  async delete(email: string): Promise<ApiResponse<{ message: string }>> {
    return this.http.delete<{ message: string }>(
      `/mailboxes/${encodeURIComponent(email)}`
    );
  }

  async deleteByDomain(domainId: string): Promise<ApiResponse<{ message: string; count: number }>> {
    return this.http.delete<{ message: string; count: number }>(
      `/mailboxes/domain/${domainId}`
    );
  }
}
