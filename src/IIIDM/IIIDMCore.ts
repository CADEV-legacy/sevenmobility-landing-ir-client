import { PCFSoftShadowMap, SRGBColorSpace, WebGLRenderer } from 'three';

import { IIIDM } from './IIIDM';

/**
 * NOTE: IIIDMCore definition.
 * 1. IIIDMCore is a singleton class.
 * 2. IIIDMCore is core of IIIDM.
 * 3. Handles canvas and renderer.
 * 4. Handles resource loading.
 */
export class IIIDMCore {
  private _canvas: HTMLCanvasElement;
  private _renderer: WebGLRenderer;

  private activeIIIDM: IIIDM | null = null;

  constructor() {
    this._renderer = new WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true,
    });

    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = PCFSoftShadowMap;
    this._renderer.outputColorSpace = SRGBColorSpace;

    this._canvas = this._renderer.domElement;

    this._canvas.style.width = '100%';
    this._canvas.style.height = '100%';

    // TODO: Add resource handlers.
  }

  get canvas() {
    return this._canvas;
  }

  get renderer() {
    return this._renderer;
  }

  changeIIIDM(newIIIDM: IIIDM) {
    if (this.activeIIIDM && this.activeIIIDM !== newIIIDM && newIIIDM.isActive)
      this.activeIIIDM.deactivate();

    this.activeIIIDM = newIIIDM;
  }
}
