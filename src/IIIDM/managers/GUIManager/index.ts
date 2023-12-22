import { GUI } from 'dat.gui';

import { IIIDMCore } from '@/IIIDM/IIIDMCore';
import { IIIDMManager } from '@/IIIDM/IIIDMManager';

export class GUIManager extends IIIDMManager {
  private _gui: GUI | null = null;

  constructor(core: IIIDMCore) {
    super(core);
  }

  get gui() {
    if (!this._gui) {
      throw this.logWorker.error('Before get GUI, please activate GUIManager.');
    }

    return this._gui;
  }

  activate() {
    this.onActivate();

    if (!this._gui) {
      this._gui = new GUI();
    }

    this._gui.open();
  }

  deactivate() {
    this.onDeactivate();

    if (!this._gui) {
      this.logWorker.warn('Already deactivated.');

      return;
    }

    this._gui.close();
  }

  initialize() {
    this.onInitialize();

    if (!this._gui) {
      this.logWorker.warn('Already initialized.');

      return;
    }

    this._gui.destroy();
    this._gui = null;
  }
}
