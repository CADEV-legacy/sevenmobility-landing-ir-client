import { OrbitControls } from 'three-stdlib';

import { IIIDMCore } from '@/IIIDM/IIIDMCore';
import { IIIDMManager } from '@/IIIDM/IIIDMManager';

export class ControlManager extends IIIDMManager {
  private _orbitControl: OrbitControls | null = null;

  constructor(core: IIIDMCore) {
    super(core);
  }

  get orbitControl() {
    return this._orbitControl;
  }

  activate() {
    this.onActivate();

    if (!this.core.activeCamera) {
      this.logWorker.error('Camera is not activated.');

      return;
    }

    if (this._orbitControl) {
      this.logWorker.warn('Already activated.');

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

    this._orbitControl.dispose();
    this._orbitControl = null;
  }

  clear() {
    this.onClear();
  }
}
