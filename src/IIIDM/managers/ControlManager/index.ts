import { OrbitControls } from 'three-stdlib';

import { IIIDM } from '@/IIIDM';
import { IIIDMManager } from '@/IIIDM/managers';
export class ControlManager extends IIIDMManager {
  private orbitControl: OrbitControls | null = null;

  constructor(maker: IIIDM) {
    super(maker);

    this.orbitControl = new OrbitControls(this.maker.activeCamera, this.maker.canvas);
    this.orbitControl.enabled = false;
  }

  initialize() {
    this.onInitialize();

    this.orbitControl = new OrbitControls(this.maker.activeCamera, this.maker.canvas);
    this.orbitControl.enabled = false;
  }

  activate() {
    this.onActivate();

    if (!this.orbitControl) throw this.logWorker.error('Not yet fully initialized.');

    this.orbitControl.enabled = true;
  }

  deactivate() {
    this.onDeactivate();

    if (!this.orbitControl) throw this.logWorker.error('Not yet fully initialized.');

    this.orbitControl.enabled = false;
  }

  clear() {
    this.onClear();

    if (!this.orbitControl) return;

    this.orbitControl.dispose();
    this.orbitControl = null;
  }
}
