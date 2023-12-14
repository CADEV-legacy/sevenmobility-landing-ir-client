import { IIIDMManager } from './IIIDMManager';

import { IIIDM } from '@/IIIDM';

export class IIIDMLogWorker<Target extends IIIDM | IIIDMManager> {
  private target: Target;
  private isDevMode: boolean;

  constructor(target: Target, isDevMode: boolean) {
    this.target = target;
    this.isDevMode = isDevMode;
  }

  /** NOTE: Using this function as notice information on dev mode. */
  info(message: string) {
    if (this.isDevMode) console.info(`[${this.target.constructor.name}] ${message}`);
  }

  /** NOTE: Using this function as notice warning on dev mode. */
  warn(message: string) {
    if (this.isDevMode) console.warn(`[${this.target.constructor.name}] ${message}`);
  }

  /** NOTE: Using this function as notice error. */
  error(message: string, error?: unknown) {
    throw new Error(`[${this.target.constructor.name}] ${message}\n${error}`);
  }
}
