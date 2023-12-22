import { IIIDMCore } from './IIIDMCore';
import { IIIDMLogWorker } from './IIIDMLogWorker';

/**
 * NOTE: All of managers are extends this abstract class.
 */
export abstract class IIIDMManager {
  protected core: IIIDMCore;
  protected logWorker: IIIDMLogWorker<IIIDMManager>;
  private _isActive: boolean = false;
  private _isInitialized: boolean = true;

  constructor(core: IIIDMCore) {
    this.core = core;

    this.logWorker = new IIIDMLogWorker(this, this.core.isDevMode);
  }

  get isActive() {
    return this._isActive;
  }

  get isInitialized() {
    return this._isInitialized;
  }

  /** NOTE: When make new manager, using this function on 'activate' is required. */
  protected onActivate() {
    if (this._isActive) {
      this.logWorker.warn('Already activated.');

      return;
    }

    this._isActive = true;

    if (this._isInitialized) this._isInitialized = false;

    this.logWorker.info('activate');
  }

  /** NOTE: When make new manager, using this function on 'deactivate' is required. */
  protected onDeactivate() {
    if (!this._isActive) {
      this.logWorker.warn('Already deactivated.');

      return;
    }

    this._isActive = false;

    this.logWorker.info('deactivate');
  }

  /** NOTE: When make new manager, using this function on 'initialize' is required. */
  protected onInitialize() {
    if (this._isInitialized) {
      this.logWorker.warn('Already initialized.');

      return;
    }

    this._isActive = false;

    this._isInitialized = true;

    this.logWorker.info('initialize');
  }

  /** NOTE: Make isActive as true, and do something. must include onActivate function that declared here.  */
  protected abstract activate(...args: unknown[]): void;
  /** NOTE: Make isActive as false, and do something. must include onDeactivate function that declared here. */
  protected abstract deactivate(): void;
  /** NOTE: Make initialize manager instance. must include onInitialize function that declared here. */
  protected abstract initialize(): void;
}
