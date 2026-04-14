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

  async get(uid: number, mailbox?: string, folder?: string): Promise<ApiResponse<MessageDetail>> {
    const params: Record<string, string> = {};
    if (mailbox) params.mailbox = mailbox;
    if (folder) params.folder = folder;
    return this.http.get<MessageDetail>(`/inbox/${uid}`, Object.keys(params).length ? params : undefined);
  }

  async markAsRead(uid: number, mailbox?: string, folder?: string): Promise<ApiResponse<{ message: string }>> {
    const params: Record<string, string> = {};
    if (mailbox) params.mailbox = mailbox;
    if (folder) params.folder = folder;
    const qs = new URLSearchParams(params).toString();
    const path = qs ? `/inbox/${uid}/read?${qs}` : `/inbox/${uid}/read`;
    return this.http.post<{ message: string }>(path, undefined);
  }

  async markAsUnread(uid: number, mailbox?: string, folder?: string): Promise<ApiResponse<{ message: string }>> {
    const params: Record<string, string> = {};
    if (mailbox) params.mailbox = mailbox;
    if (folder) params.folder = folder;
    const qs = new URLSearchParams(params).toString();
    const path = qs ? `/inbox/${uid}/unread?${qs}` : `/inbox/${uid}/unread`;
    return this.http.post<{ message: string }>(path, undefined);
  }

  async move(uid: number, to: string, from = 'INBOX'): Promise<ApiResponse<{ message: string }>> {
    return this.http.post<{ message: string }>(`/inbox/${uid}/move`, { from, to });
  }

  async delete(uid: number, mailbox?: string, folder?: string): Promise<ApiResponse<{ message: string }>> {
    const params: Record<string, string> = {};
    if (mailbox) params.mailbox = mailbox;
    if (folder) params.folder = folder;
    const qs = new URLSearchParams(params).toString();
    const path = qs ? `/inbox/${uid}?${qs}` : `/inbox/${uid}`;
    return this.http.delete<{ message: string }>(path);
  }

  async getAttachments(uid: number, mailbox?: string, folder?: string): Promise<ApiResponse<AttachmentInfo[]>> {
    const params: Record<string, string> = {};
    if (mailbox) params.mailbox = mailbox;
    if (folder) params.folder = folder;
    return this.http.get<AttachmentInfo[]>(`/inbox/${uid}/attachments`, Object.keys(params).length ? params : undefined);
  }

  async downloadAttachment(uid: number, partId: string, mailbox?: string, folder?: string): Promise<ArrayBuffer> {
    const params: Record<string, string> = {};
    if (mailbox) params.mailbox = mailbox;
    if (folder) params.folder = folder;
    const res = await this.http.getRaw(
      `/inbox/${uid}/attachments/${partId}/download`,
      Object.keys(params).length ? params : undefined
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
