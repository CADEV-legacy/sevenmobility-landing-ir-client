import { OrbitControls } from 'three-stdlib';

import { IIIDM } from '@/IIIDM';
import { IIIDMManager } from '@/IIIDM/managers';
export class ControlManager extends IIIDMManager {
  private _orbitControl: OrbitControls;

  constructor(maker: IIIDM) {
    super(maker);

    this._orbitControl = new OrbitControls(this.maker.activeCamera, this.maker.canvas);
    this._orbitControl.enabled = false;
  }

  get orbitControl() {
    return this._orbitControl;
  }

  initialize() {
    this.onInitialize();
  }

  activate() {
    this.onActivate();

    this._orbitControl.enabled = true;
  }

  deactivate() {
    this.onDeactivate();

    this._orbitControl.enabled = false;
  }

  clear() {
    this.onClear();

    this._orbitControl.dispose();
  }
}
