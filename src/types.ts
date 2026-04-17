// ── Config ──

export interface SentroyConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
}

// ── API Response ──

export interface ApiResponse<T> {
  data: T;
  meta?: PaginationMeta;
  error?: string;
  details?: { field: string; message: string }[];
}

export interface PaginationMeta {
  page: number;
  limit: number;
  totalCount: number;
  totalPages: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
}

// ── Domain ──

export interface Domain {
  id: string;
  domain: string;
  status: 'pending' | 'verifying' | 'active' | 'failed';
  spfVerified: boolean;
  dkimVerified: boolean;
  dmarcVerified: boolean;
  dkimSelector: string;
  dkimPublicKey?: string;
  createdAt: string;
  updatedAt: string;
}

export interface DnsRecord {
  type: string;
  name: string;
  value: string;
  priority?: number;
}

export interface DomainWithDns extends Domain {
  dnsRecords: DnsRecord[];
}

export interface DomainVerification {
  spf: boolean;
  dkim: boolean;
  dmarc: boolean;
  details: {
    spf: string | null;
    dkim: string | null;
    dmarc: string | null;
  };
}

export interface CreateDomainParams {
  domain: string;
}

// ── Template ──

/** Çok dilli metin. `"Hello"` (tek dil) veya `{ en: "Hello", tr: "Merhaba" }` (çok dil) olabilir. */
export type LocalizedString = string | Record<string, string>;

export interface Template {
  id: string;
  name: LocalizedString;
  subject: LocalizedString;
  mjmlBody: LocalizedString;
  htmlBody: LocalizedString;
  variables: string[];
  domainId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTemplateParams {
  name: LocalizedString;
  subject: LocalizedString;
  mjmlBody: LocalizedString;
  domainId: string;
}

export interface UpdateTemplateParams {
  name?: LocalizedString;
  subject?: LocalizedString;
  mjmlBody?: LocalizedString;
}

export interface TemplatePreview {
  html: string;
  subject: string;
  templateVariables: string[];
}

// ── Send ──

export interface Attachment {
  filename: string;
  content: string;
  contentType?: string;
}

export interface SendSingleParams {
  to: string;
  from: string;
  cc?: string | string[];
  subject: string;
  domainId: string;
  templateId?: string;
  /** Template dil kodu (orn. "en", "tr"). Belirtilmezse varsayilan dil kullanilir. */
  lang?: string;
  html?: string;
  text?: string;
  variables?: Record<string, string>;
  replyTo?: string;
  attachments?: Attachment[];
  scheduledAt?: string;
  headers?: Record<string, string>;
  /** RFC 5322 — yanit verilen mesajin Message-ID'si */
  inReplyTo?: string;
  /** RFC 5322 — thread'deki onceki Message-ID'ler */
  references?: string[];
}

export interface SendBatchParams {
  recipients: { to: string; variables?: Record<string, string> }[];
  from: string;
  cc?: string | string[];
  subject: string;
  domainId: string;
  templateId?: string;
  /** Template dil kodu (orn. "en", "tr"). Belirtilmezse varsayilan dil kullanilir. */
  lang?: string;
  html?: string;
  text?: string;
  replyTo?: string;
  attachments?: Attachment[];
  scheduledAt?: string;
  headers?: Record<string, string>;
}

export interface SendResult {
  jobId: string;
  mailLogId: string;
  status: string;
  scheduledAt?: string;
}

export interface BatchSendResult {
  totalQueued: number;
  totalSuppressed: number;
  jobs: { jobId: string; mailLogId: string; to: string }[];
}

export interface JobStatus {
  jobId: string;
  state: string;
  progress: number;
  attemptsMade: number;
  failedReason: string | null;
  finishedOn: number | null;
  processedOn: number | null;
}

// ── Inbox ──

export interface MessageAddress {
  name: string;
  address: string;
}

export interface MessageSummary {
  uid: number;
  subject: string;
  from: MessageAddress;
  to: MessageAddress[];
  date: string;
  seen: boolean;
  flagged: boolean;
  size: number;
  hasAttachments: boolean;
  preview: string;
  /** RFC 5322 Message-ID */
  messageId: string | null;
  /** Yanit verilen mesajin Message-ID'si */
  inReplyTo: string | null;
}

export interface MessageDetail {
  uid: number;
  subject: string;
  from: MessageAddress;
  to: MessageAddress[];
  cc: MessageAddress[];
  replyTo: MessageAddress | null;
  date: string;
  seen: boolean;
  flagged: boolean;
  textBody: string | null;
  htmlBody: string | null;
  attachments: AttachmentInfo[];
  headers: Record<string, string>;
  /** RFC 5322 Message-ID */
  messageId: string | null;
  /** Yanit verilen mesajin Message-ID'si */
  inReplyTo: string | null;
  /** Thread'deki onceki Message-ID'lerin tam zinciri */
  references: string[];
}

export interface AttachmentInfo {
  partId: string;
  filename: string;
  size: number;
  contentType: string;
  contentId: string | null;
}

export interface Mailbox {
  name: string;
  path: string;
  specialUse: string | null;
  totalMessages: number;
  unreadMessages: number;
}

export interface InboxListParams extends PaginationParams {
  unread?: boolean;
  /** Email account address (e.g. inbox@mail.example.com) */
  mailbox?: string;
  /** IMAP folder name (e.g. INBOX, Sent, Trash). Defaults to INBOX. */
  folder?: string;
}

export interface InboxSearchParams {
  q?: string;
  from?: string;
  subject?: string;
  since?: string;
  before?: string;
  /** Email account address (e.g. inbox@mail.example.com) */
  mailbox?: string;
  /** IMAP folder name to search in. Defaults to INBOX. */
  folder?: string;
}

// ── Logs ──

export interface MailLog {
  id: string;
  to: string;
  from: string;
  subject: string;
  status: 'queued' | 'processing' | 'sent' | 'bounced' | 'failed';
  messageId: string | null;
  domainId: string;
  domain?: { domain: string };
  templateId: string | null;
  variables: Record<string, any> | null;
  createdAt: string;
  sentAt: string | null;
  bouncedAt: string | null;
  error: string | null;
  scheduledAt?: string | null;
  openedAt?: string | null;
  clickedAt?: string | null;
}

export interface LogListParams extends PaginationParams {
  status?: string;
  domainId?: string;
  from?: string;
  to?: string;
}

// ── API Keys ──

export interface ApiKey {
  id: string;
  name: string;
  scopes: string[];
  domainId: string | null;
  lastUsed: string | null;
  createdAt: string;
  expiresAt: string | null;
}

export interface ApiKeyWithSecret extends ApiKey {
  key: string;
  _warning: string;
}

export interface CreateApiKeyParams {
  name: string;
  scopes: ('send' | 'read' | 'admin')[];
  domainId?: string | null;
  expiresAt?: string | null;
}

// ── Mailbox Users ──

export interface MailboxUser {
  email: string;
  domain: string;
  username: string;
  domainId?: string;
}

export interface CreateMailboxParams {
  email: string;
  password: string;
  domainId: string;
}

// ── Health ──

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  services: Record<string, string>;
  uptime: number;
  timestamp: string;
}

export interface QueueHealth {
  queue: string;
  counts: {
    waiting: number;
    active: number;
    completed: number;
    failed: number;
    delayed: number;
  };
  timestamp: string;
}

// ── Webhooks ──

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  active: boolean;
  domainId: string;
  secret?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateWebhookParams {
  url: string;
  events: string[];
  domainId: string;
}

export interface UpdateWebhookParams {
  url?: string;
  events?: string[];
  active?: boolean;
}

// ── Suppressions ──

export interface Suppression {
  id: string;
  email: string;
  reason: string;
  domainId: string;
  createdAt: string;
  domain?: { domain: string };
}

export interface AddSuppressionParams {
  email: string;
  reason?: string;
  domainId: string;
}

export interface SuppressionListParams extends PaginationParams {
  domainId?: string;
  reason?: string;
}

// ── Tracking ──

export interface TrackingEvent {
  id: string;
  mailLogId: string;
  type: string;
  url?: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
}

// ── Validation ──

export interface ValidationResult {
  valid: boolean;
  email: string;
  checks: {
    syntax: boolean;
    mxExists: boolean;
    disposable: boolean;
  };
  suggestion?: string;
}

// ── Statistics ──

export interface StatisticsOverview {
  total: number;
  sent: number;
  bounced: number;
  failed: number;
  queued: number;
  opened: number;
  clicked: number;
  rates: {
    delivery: number;
    bounce: number;
    open: number;
    click: number;
  };
}

export interface DailyStats {
  date: string;
  sent: number;
  bounced: number;
  failed: number;
  opened: number;
  clicked: number;
}

export interface DomainStats {
  id: string;
  domain: string;
  status: string;
  totalMails: number;
  templates: number;
  suppressions: number;
  sent: number;
  bounced: number;
  opened: number;
  deliveryRate: number;
}
