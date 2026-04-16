# @sentroy-co/sdk

TypeScript SDK for the Sentroy Mail Server API. Zero dependencies, native `fetch`, full type safety.

## Install

```bash
npm install @sentroy-co/sdk
```

## Quick Start

```typescript
import { SentroyClient } from '@sentroy-co/sdk';

const sentroy = new SentroyClient({
  baseUrl: 'https://mail-api.example.com',
  apiKey: 'sk_...',
});
```

## Domains

```typescript
// Add a domain
const { data: domain } = await sentroy.domains.create({ domain: 'example.com' });

// Get DNS records to configure
const { data: dns } = await sentroy.domains.getDnsRecords(domain.id);
// Returns SPF, DKIM, DMARC, MX, A records ready to copy-paste

// Verify DNS configuration
const { data: result } = await sentroy.domains.verify(domain.id);
// result.verification.spf / .dkim / .dmarc → true/false

// List all domains
const { data: domains, meta } = await sentroy.domains.list({ page: 1, limit: 20 });

// Delete
await sentroy.domains.delete(domain.id);
```

## Templates

```typescript
// Create an MJML template
const { data: template } = await sentroy.templates.create({
  name: 'Welcome Email',
  subject: 'Welcome {{name}}!',
  mjmlBody: `<mjml>
    <mj-body>
      <mj-section>
        <mj-column>
          <mj-text>Hello {{name}}, welcome to {{company}}!</mj-text>
        </mj-column>
      </mj-section>
    </mj-body>
  </mjml>`,
  domainId: domain.id,
});
// template.variables → ["name", "company"]
// template.htmlBody → compiled HTML (cached)

// Preview with variables filled in
const { data: preview } = await sentroy.templates.preview(template.id, {
  name: 'John',
  company: 'Acme',
});
// preview.html → rendered HTML
// preview.subject → "Welcome John!"

// Update
await sentroy.templates.update(template.id, {
  subject: 'Hey {{name}}, welcome aboard!',
});

// List (filter by domain)
const { data: templates } = await sentroy.templates.list({ domainId: domain.id });
```

## Sending Emails

```typescript
// Send a single email
const { data: result } = await sentroy.send.single({
  to: 'user@gmail.com',
  from: 'hello@example.com',
  subject: 'Hello!',
  templateId: template.id,
  variables: { name: 'John', company: 'Acme' },
  domainId: domain.id,
});
// result.jobId, result.mailLogId, result.status → "queued"

// Send with raw HTML
await sentroy.send.single({
  to: 'user@gmail.com',
  from: 'hello@example.com',
  subject: 'Quick update',
  html: '<h1>Hello!</h1><p>This is a quick update.</p>',
  domainId: domain.id,
});

// Send with attachments
await sentroy.send.single({
  to: 'user@gmail.com',
  from: 'hello@example.com',
  subject: 'Your invoice',
  html: '<p>Please find your invoice attached.</p>',
  domainId: domain.id,
  attachments: [
    {
      filename: 'invoice.pdf',
      content: base64EncodedPdf, // base64 string
      contentType: 'application/pdf',
    },
  ],
});

// Reply to a message (threading)
await sentroy.send.single({
  to: 'user@gmail.com',
  from: 'hello@example.com',
  subject: 'Re: Project update',
  html: '<p>Thanks for the update!</p>',
  domainId: domain.id,
  inReplyTo: '<original-message-id@mail.example.com>',
  references: [
    '<root-message-id@mail.example.com>',
    '<original-message-id@mail.example.com>',
  ],
});
// Sets RFC 5322 In-Reply-To and References headers
// All mail clients (Gmail, Outlook, Apple Mail) will display this as a thread

// Schedule for later
await sentroy.send.single({
  to: 'user@gmail.com',
  from: 'hello@example.com',
  subject: 'Scheduled email',
  html: '<p>This was scheduled!</p>',
  domainId: domain.id,
  scheduledAt: '2025-01-15T09:00:00Z',
});

// Batch send (max 500 recipients)
const { data: batch } = await sentroy.send.batch({
  recipients: [
    { to: 'user1@gmail.com', variables: { name: 'Alice' } },
    { to: 'user2@gmail.com', variables: { name: 'Bob' } },
  ],
  from: 'hello@example.com',
  subject: 'Hello {{name}}',
  templateId: template.id,
  domainId: domain.id,
});
// batch.totalQueued → 2, batch.totalSuppressed → 0

// Check job status
const { data: status } = await sentroy.send.getJobStatus(result.jobId);
// status.state → "completed" | "failed" | "delayed" | ...

// Cancel a scheduled send
await sentroy.send.cancel(result.jobId);
```

## Inbox (IMAP)

Inbox methods accept two optional scope parameters:

- **`mailbox`** — The email account address (e.g. `inbox@mail.example.com`). Identifies which mailbox account to operate on.
- **`folder`** — The IMAP folder name (e.g. `INBOX`, `Sent`, `Trash`, `Drafts`). Defaults to `INBOX` when omitted.

```typescript
// List messages from INBOX
const { data: messages, meta } = await sentroy.inbox.list({
  mailbox: 'inbox@mail.example.com',
  page: 1,
  limit: 20,
  unread: true,
});
// Each message includes threading fields:
// messages[0].messageId → "<abc@mail.example.com>"
// messages[0].inReplyTo → "<parent-id@...>" (null if not a reply)

// List messages from Sent folder
const { data: sent } = await sentroy.inbox.list({
  mailbox: 'inbox@mail.example.com',
  folder: 'Sent',
});

// Read a message (full body, headers, attachments, threading info)
const { data: message } = await sentroy.inbox.get(messages[0].uid);
// message.textBody, message.htmlBody, message.attachments, message.headers
// message.messageId → "<abc@mail.example.com>" (for threading)
// message.inReplyTo → "<parent-id@mail.example.com>"
// message.references → ["<root-id@...>", "<parent-id@...>"]

// Mark as read / unread
await sentroy.inbox.markAsRead(123);
await sentroy.inbox.markAsUnread(123);

// Move to folder
await sentroy.inbox.move(123, 'Trash');

// Delete
await sentroy.inbox.delete(123);

// Search within a specific folder
const { data: results } = await sentroy.inbox.search({
  mailbox: 'inbox@mail.example.com',
  folder: 'INBOX',
  from: 'sender@example.com',
  subject: 'invoice',
  since: '2025-01-01',
});

// List IMAP folders for the account
const { data: mailboxes } = await sentroy.inbox.listMailboxes();
// [{ name: "INBOX", path: "INBOX", totalMessages: 42, unreadMessages: 5 }, ...]

// Toggle flagged / starred
await sentroy.inbox.toggleFlag(123, 'inbox@mail.example.com');

// Get full thread (cross-folder: INBOX + Sent merged)
const { data: thread } = await sentroy.inbox.getThread(
  'Project update',           // subject (Re:/Fwd: stripped automatically)
  'inbox@mail.example.com',
);
// Returns all messages in the conversation, chronologically sorted
// Each message includes a `folder` field ("INBOX" or "Sent")
// thread[0].from, thread[0].htmlBody, thread[0].folder → "INBOX"
// thread[1].from, thread[1].htmlBody, thread[1].folder → "Sent"

// Download attachment
const buffer = await sentroy.inbox.downloadAttachment(123, '1.2');
```

## Mail Logs

```typescript
// List logs (filter by status, domain, sender, recipient)
const { data: logs, meta } = await sentroy.logs.list({
  status: 'bounced',
  domainId: domain.id,
  from: 'hello@example.com',
  to: 'user@gmail.com',
  page: 1,
  limit: 50,
});
// logs[0].status → "bounced"
// logs[0].messageId → "<abc@mail.example.com>"
// logs[0].sentAt, .bouncedAt, .openedAt, .clickedAt

// Get a single log entry
const { data: log } = await sentroy.logs.get(logs[0].id);
```

## Webhooks

```typescript
// Create a webhook
const { data: webhook } = await sentroy.webhooks.create({
  url: 'https://myapp.com/webhooks/mail',
  events: ['sent', 'bounced', 'opened', 'clicked', 'unsubscribed'],
  domainId: domain.id,
});
// webhook.secret → HMAC signing secret (shown only once)

// List webhooks
const { data: webhooks } = await sentroy.webhooks.list(domain.id);

// Update
await sentroy.webhooks.update(webhook.id, { active: false });

// Delete
await sentroy.webhooks.delete(webhook.id);
```

**Webhook payload** sent to your endpoint:

```json
{
  "event": "bounced",
  "timestamp": "2025-01-15T09:00:00.000Z",
  "data": {
    "mailLogId": "...",
    "to": "user@example.com",
    "from": "hello@yourdomain.com",
    "subject": "Hello!",
    "domainId": "...",
    "messageId": "<abc@mail.yourdomain.com>"
  }
}
```

Verify with the `X-Sentroy-Signature` header (HMAC-SHA256 of the raw body using your webhook secret).

## Suppression List

Emails that bounced or unsubscribed are automatically added. Suppressed emails are blocked at send time.

```typescript
// Check if an email is suppressed
const { data } = await sentroy.suppressions.check('user@gmail.com', domainId);
// data.suppressed → true/false, data.reason → "bounce" | "unsubscribe" | ...

// List suppressions
const { data: list } = await sentroy.suppressions.list({
  domainId: domain.id,
  reason: 'bounce',
});

// Manually add
await sentroy.suppressions.add({
  email: 'spam-trap@example.com',
  reason: 'manual',
  domainId: domain.id,
});

// Remove (re-enable sending)
await sentroy.suppressions.remove(suppressionId);
```

## Statistics

```typescript
// Overview (optionally filter by domain and date range)
const { data: stats } = await sentroy.statistics.overview({
  domainId: domain.id,
  from: '2025-01-01',
  to: '2025-01-31',
});
// stats.rates.delivery → 98.5
// stats.rates.bounce → 1.2
// stats.rates.open → 45.3
// stats.rates.click → 12.1

// Daily breakdown
const { data: daily } = await sentroy.statistics.daily({
  domainId: domain.id,
  days: 30,
});
// [{ date: "2025-01-15", sent: 150, bounced: 2, opened: 68, clicked: 15 }, ...]

// Per-domain summary
const { data: domains } = await sentroy.statistics.domains();
```

## Email Validation

```typescript
// Validate a single email
const { data: result } = await sentroy.validate.email('user@gmial.com');
// result.valid → false
// result.checks.syntax → true
// result.checks.mxExists → false
// result.checks.disposable → false
// result.suggestion → "user@gmail.com"

// Batch validate (max 100)
const { data: results, meta } = await sentroy.validate.batch([
  'valid@gmail.com',
  'invalid@nonexistent.tld',
  'throwaway@mailinator.com',
]);
// meta.valid → 1, meta.invalid → 2
```

## API Keys

```typescript
// Create (plain key is shown only once)
const { data: key } = await sentroy.apiKeys.create({
  name: 'Production',
  scopes: ['send', 'read'],
  domainId: domain.id, // optional — null = all domains
});
// key.key → "sk_..." (save this!)

// List
const { data: keys } = await sentroy.apiKeys.list();

// Revoke
await sentroy.apiKeys.revoke(key.id);
```

## Mailbox Users

```typescript
// Create a mailbox (Dovecot user)
await sentroy.mailboxes.create({
  email: 'info@example.com',
  password: 'secure-password',
  domainId: domain.id,
});

// List
const { data: users } = await sentroy.mailboxes.list(domain.id);

// Update password
await sentroy.mailboxes.updatePassword('info@example.com', 'new-password');

// Delete
await sentroy.mailboxes.delete('info@example.com');
```

## Health

```typescript
const { data: health } = await sentroy.health.check();
// health.status → "healthy" | "degraded" | "unhealthy"
// health.services → { postgres: "ok", redis: "ok", postfix: "ok", ... }

const { data: queue } = await sentroy.health.queue();
// queue.counts → { waiting: 0, active: 2, completed: 1500, failed: 3, delayed: 10 }
```

## Error Handling

```typescript
import { SentroyClient, SentroyHttpError } from '@sentroy-co/sdk';

try {
  await sentroy.send.single({ /* ... */ });
} catch (err) {
  if (err instanceof SentroyHttpError) {
    console.error(err.statusCode); // 400, 401, 403, 422, 429...
    console.error(err.body.error);  // "Email is in the suppression list"
    console.error(err.body.details); // [{ field: "to", message: "Invalid email" }]
  }
}
```

## Configuration

```typescript
const sentroy = new SentroyClient({
  baseUrl: 'https://mail-api.example.com', // API server URL
  apiKey: 'sk_...',                         // Bearer token
  timeout: 30000,                           // Request timeout in ms (default: 30s)
});
```

## License

MIT
