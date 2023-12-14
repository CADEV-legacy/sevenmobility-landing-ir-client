import { IIIDMCore } from './IIIDMCore';
import { IIIDMLogWorker } from './IIIDMLogWorker';

/**
 * NOTE: All of managers are extends this abstract class.
 */
export abstract class IIIDMManager {
  protected core: IIIDMCore;
  protected isActive: boolean = false;
  protected isInitialized: boolean = true;
  protected logWorker: IIIDMLogWorker<IIIDMManager>;

  constructor(core: IIIDMCore) {
    this.core = core;

    this.logWorker = new IIIDMLogWorker(this, this.core.isDevMode);
  }

  /** NOTE: When make new manager, using this function on 'activate' is required. */
  protected onActivate() {
    if (this.isActive) {
      this.logWorker.warn('Already activated.');

      return;
    }

    this.isActive = true;

    if (this.isInitialized) this.isInitialized = false;

    this.logWorker.info('activate');
  }

  /** NOTE: When make new manager, using this function on 'deactivate' is required. */
  protected onDeactivate() {
    if (!this.isActive) {
      this.logWorker.warn('Already deactivated.');

      return;
    }

    this.isActive = false;

    this.logWorker.info('deactivate');
  }

  /** NOTE: When make new manager, using this function on 'clear' is required. */
  protected onClear() {
    if (this.isInitialized) {
      this.logWorker.warn('Already cleared.');

      return;
    }

    this.onDeactivate();

    this.isInitialized = true;

    this.logWorker.info('clear');
  }

  /** NOTE: Make isActive as true, and do something. must include onActivate function that declared here.  */
  protected abstract activate(): void;
  /** NOTE: Make isActive as false, and do something. must include onDeactivate function that declared here. */
  protected abstract deactivate(): void;
  /** NOTE: Make clear manager instance. must include onClear function that declared here. */
  protected abstract clear(): void;
}
