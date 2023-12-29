import { IIIDMWorker } from './IIIDMWorker';

import { IIIDM } from '@/IIIDM';
import { IIIDMManager } from '@/IIIDM/managers';

export class LogWorker<Target extends IIIDM | IIIDMManager | IIIDMWorker> extends IIIDMWorker {
  private target: Target;
  private isDevMode: boolean;

  constructor(maker: IIIDM, target: Target) {
    super(maker);
    this.target = target;
    this.isDevMode = maker.isDevMode;
  }

  private getLogPrefix() {
    if (this.target.constructor.name === this.maker.constructor.name)
      return `[${this.target.constructor.name}]`;

    return `[${this.maker.constructor.name}] [${this.target.constructor.name}]`;
  }

  /** NOTE: Using this function as notice information on dev mode. */
  info(message: string) {
    if (this.isDevMode) console.info(`${this.getLogPrefix()} ${message}`);
  }

  /** NOTE: Using this function as notice warning on dev mode. */
  warn(message: string) {
    if (this.isDevMode) console.warn(`${this.getLogPrefix()} ${message}`);
  }

  /** NOTE: Using this function as notice error. */
  error(message: string, error?: unknown): Error {
    return new Error(`${this.getLogPrefix()} ${message}\n${error}`);
  }
}
