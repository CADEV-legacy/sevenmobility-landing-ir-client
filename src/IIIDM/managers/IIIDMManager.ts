import { IIIDM } from '@/IIIDM';
import { LogWorker } from '@/IIIDM/workers';
/**
 * NOTE: All of managers are extends this abstract class.
 * - Managed status is 2. (isInitialized, isActive)
 * - Managers are constructed by IIIDM.
 * 1. Before activate manager, must be initialized. (for set required parameters)
 * 2. When activate manager, manager will be working.
 * 3. When deactivate manager, manager will be stop working.
 * 4. When clear manager, manager will be clear status. (for unset required parameters)
 */
export abstract class IIIDMManager {
  protected maker: IIIDM;
  protected logWorker: LogWorker<IIIDMManager>;
  private _isInitialized: boolean = false;
  private _isActive: boolean = false;

  constructor(maker: IIIDM) {
    this.maker = maker;

    this.logWorker = new LogWorker(this.maker, this);
  }

  get isInitialized() {
    return this._isInitialized;
  }

  get isActive() {
    return this._isActive;
  }

  /** NOTE: Make this manager instance for available. */
  protected onInitialize() {
    if (this._isInitialized) throw this.logWorker.error('Already initialized.');

    this._isInitialized = true;

    this.logWorker.info('initialize');
  }

  /** NOTE: Make working for role. */
  protected onActivate() {
    if (!this._isInitialized) throw this.logWorker.error('Not initialized.');

    if (this._isActive) throw this.logWorker.error('Already activated.');

    this._isActive = true;

    this.logWorker.info('activate');
  }

  /** NOTE: Make not working for role. */
  protected onDeactivate() {
    if (!this._isInitialized) throw this.logWorker.error('Not initialized.');

    if (!this._isActive) throw this.logWorker.error('Already deactivated.');

    this._isActive = false;

    this.logWorker.info('deactivate');
  }

  /** NOTE: Make clear manager instance. */
  protected onClear() {
    this._isInitialized = false;
    this._isActive = false;

    this.logWorker.info('clear');
  }

  /** NOTE: When additional status is required, implement this method. but if you not, just using onInitialize function on constructor. */
  protected abstract initialize(...args: unknown[]): void;
  /** NOTE: Make isActive as true, and do something. must include onActivate function that declared here.  */
  protected abstract activate(): void;
  /** NOTE: Make isActive as false, and do something. must include onDeactivate function that declared here. */
  protected abstract deactivate(): void;
  /** NOTE: Remove status of manager instance. must include onClear function that declared here. */
  protected abstract clear(): void;
}
