import { OrbitControls } from 'three-stdlib';

import { IIIDMCore } from '@/IIIDM/IIIDMCore';
import { IIIDMManager } from '@/IIIDM/IIIDMManager';

export class ControlManager extends IIIDMManager {
  private _orbitControl: OrbitControls | null = null;

  constructor(core: IIIDMCore) {
    super(core);
  }

  get orbitControl() {
    if (!this._orbitControl) {
      throw this.logWorker.error('Before get orbitControl, please activate ControlManager.');
    }

    return this._orbitControl;
  }

  activate() {
    this.onActivate();

    if (!this.core.activeCamera) {
      throw this.logWorker.error('Camera is not activated.');
    }

    if (this._orbitControl) {
      this.logWorker.warn('Already activated.');
      this._orbitControl.enabled = true;

      return;
    }

    this._orbitControl = new OrbitControls(this.core.activeCamera, this.core.renderer.domElement);
  }

  deactivate() {
    this.onDeactivate();

    if (!this._orbitControl) {
      this.logWorker.warn('Already deactivated.');

      return;
    }

    this._orbitControl.enabled = false;
  }

  initialize() {
    this.onInitialize();

    if (!this._orbitControl) {
      this.logWorker.warn('Already initialized.');

      return;
    }

    this._orbitControl.dispose();
    this._orbitControl = null;
  }
}
