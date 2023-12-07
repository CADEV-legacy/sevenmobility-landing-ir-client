import { PerspectiveCamera, WebGLRenderer } from 'three';

import { IIIDMCore } from './IIIDMCore';

export abstract class IIIDM {
  private _isActive: boolean = false;
  private activeIIIDMCore: IIIDMCore | null = null;
  private canvas: HTMLCanvasElement;
  private renderer: WebGLRenderer;
  private camera: PerspectiveCamera;
  // TODO: Resource handler will be defined.

  constructor(newIIIDMCore?: IIIDMCore) {
    this.activeIIIDMCore = newIIIDMCore || new IIIDMCore();

    this.canvas = this.activeIIIDMCore.canvas;
    this.renderer = this.activeIIIDMCore.renderer;
    this.camera = new PerspectiveCamera(50, 1, 0.1, 1000);
    // TOOD: Set reousrce handler.
  }

  get isActive() {
    return this._isActive;
  }

  activate() {
    if (this._isActive) return;

    if (!this.activeIIIDMCore) throw new Error('IIIDMCore is not defined.');

    this.activeIIIDMCore.changeIIIDM(this);
    this.onActivate();
    this._isActive = true;
  }

  deactivate() {
    if (!this._isActive) return;

    this.onDeactivate();
    this._isActive = false;
  }

  // NOTE: Handle status of IIIDM.
  private onActivate() {}

  private onDeactivate() {}

  abstract initialize(): void;
  abstract update(): void;
  abstract resize(): void;
}
