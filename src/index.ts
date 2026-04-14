import { HttpClient } from './http';
import { Domains } from './resources/domains';
import { Templates } from './resources/templates';
import { Send } from './resources/send';
import { Inbox } from './resources/inbox';
import { Logs } from './resources/logs';
import { ApiKeys } from './resources/api-keys';
import { Mailboxes } from './resources/mailboxes';
import { Health } from './resources/health';
import { Webhooks } from './resources/webhooks';
import { Suppressions } from './resources/suppressions';
import { Statistics } from './resources/statistics';
import { Validate } from './resources/validate';
import type { SentroyConfig } from './types';

export class SentroyClient {
  public readonly domains: Domains;
  public readonly templates: Templates;
  public readonly send: Send;
  public readonly inbox: Inbox;
  public readonly logs: Logs;
  public readonly apiKeys: ApiKeys;
  public readonly mailboxes: Mailboxes;
  public readonly health: Health;
  public readonly webhooks: Webhooks;
  public readonly suppressions: Suppressions;
  public readonly statistics: Statistics;
  public readonly validate: Validate;

  constructor(config: SentroyConfig) {
    const http = new HttpClient(config);

    this.domains = new Domains(http);
    this.templates = new Templates(http);
    this.send = new Send(http);
    this.inbox = new Inbox(http);
    this.logs = new Logs(http);
    this.apiKeys = new ApiKeys(http);
    this.mailboxes = new Mailboxes(http);
    this.health = new Health(http);
    this.webhooks = new Webhooks(http);
    this.suppressions = new Suppressions(http);
    this.statistics = new Statistics(http);
    this.validate = new Validate(http);
  }
}

// Re-export everything
export { SentroyHttpError } from './http';
export * from './types';
export {
  resolveLocalized,
  localizedLanguages,
  isLocalizedMap,
} from './helpers/localized';
