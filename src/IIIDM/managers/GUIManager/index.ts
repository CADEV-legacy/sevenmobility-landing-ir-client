import { GUI } from 'dat.gui';

import { IIIDM } from '@/IIIDM';
import { IIIDMManager } from '@/IIIDM/managers/IIIDMManager';

export class GUIManager extends IIIDMManager {
  private _gui: GUI | null = null;

  constructor(maker: IIIDM) {
    super(maker);
  }

  get gui() {
    if (!this._gui) throw this.logWorker.error('Before get gui, please initialize GUIManager.');

    return this._gui;
  }

  initialize() {
    this.onInitialize();

    this._gui = new GUI();
  }

  activate() {
    this.onActivate();

    this._gui!.open();
  }

  deactivate() {
    this.onDeactivate();

    this._gui!.close();
  }

  clear() {
    this.onClear();

    if (!this._gui) return;

    this._gui.destroy();
    this._gui = null;
  }
}
