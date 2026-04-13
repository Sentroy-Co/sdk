import { HttpClient } from '../http';
import type {
  ApiResponse,
  MessageSummary,
  MessageDetail,
  AttachmentInfo,
  Mailbox,
  InboxListParams,
  InboxSearchParams,
} from '../types';

export class Inbox {
  constructor(private http: HttpClient) {}

  async list(params?: InboxListParams): Promise<ApiResponse<MessageSummary[]>> {
    return this.http.get<MessageSummary[]>('/inbox', params as any);
  }

  async get(uid: number, mailbox?: string): Promise<ApiResponse<MessageDetail>> {
    return this.http.get<MessageDetail>(`/inbox/${uid}`, mailbox ? { mailbox } : undefined);
  }

  async markAsRead(uid: number, mailbox?: string): Promise<ApiResponse<{ message: string }>> {
    return this.http.post<{ message: string }>(`/inbox/${uid}/read`, undefined);
  }

  async markAsUnread(uid: number, mailbox?: string): Promise<ApiResponse<{ message: string }>> {
    return this.http.post<{ message: string }>(`/inbox/${uid}/unread`, undefined);
  }

  async move(uid: number, to: string, from = 'INBOX'): Promise<ApiResponse<{ message: string }>> {
    return this.http.post<{ message: string }>(`/inbox/${uid}/move`, { from, to });
  }

  async delete(uid: number, mailbox?: string): Promise<ApiResponse<{ message: string }>> {
    return this.http.delete<{ message: string }>(`/inbox/${uid}`);
  }

  async getAttachments(uid: number, mailbox?: string): Promise<ApiResponse<AttachmentInfo[]>> {
    return this.http.get<AttachmentInfo[]>(`/inbox/${uid}/attachments`, mailbox ? { mailbox } : undefined);
  }

  async downloadAttachment(uid: number, partId: string, mailbox?: string): Promise<ArrayBuffer> {
    const res = await this.http.getRaw(
      `/inbox/${uid}/attachments/${partId}/download`,
      mailbox ? { mailbox } : undefined
    );
    return res.arrayBuffer();
  }

  async search(params: InboxSearchParams): Promise<ApiResponse<MessageSummary[]>> {
    return this.http.get<MessageSummary[]>('/inbox/search', params as any);
  }

  async listMailboxes(): Promise<ApiResponse<Mailbox[]>> {
    return this.http.get<Mailbox[]>('/inbox/mailboxes');
  }
}
