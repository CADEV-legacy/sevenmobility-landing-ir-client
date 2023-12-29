import { PCFSoftShadowMap, ReinhardToneMapping, SRGBColorSpace, WebGLRenderer } from 'three';

import { IIIDM } from '.';

/**
 * NOTE: Save singleton properties in this class.
 * IIIDMCore is a singleton class. (That means, only one IIIDMCore instance is alive in one project.)
 */
export class IIIDMCore {
  private _canvas: HTMLCanvasElement;
  private _renderer: WebGLRenderer;
  private _isDevMode: boolean;
  private _activeIIIDM: IIIDM | null = null;

  constructor(isDevMode: boolean) {
    this._isDevMode = isDevMode;

    this._renderer = new WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true,
    });
    this._renderer.setPixelRatio(window.devicePixelRatio);
    this._renderer.shadowMap.enabled = true;
    this._renderer.shadowMap.type = PCFSoftShadowMap;
    this._renderer.outputColorSpace = SRGBColorSpace;
    this._renderer.toneMapping = ReinhardToneMapping;

    this._canvas = this._renderer.domElement;
    this._canvas.style.width = '100%';
    this._canvas.style.height = '100%';
  }

  get canvas() {
    return this._canvas;
  }

  get renderer() {
    return this._renderer;
  }

  get isDevMode() {
    return this._isDevMode;
  }

  /** NOTE: When this method is working, dispose activeIIIDM and clear all managers. */
  changeIIIDM(newIIIDM: IIIDM) {
    if (this._activeIIIDM && this._activeIIIDM !== newIIIDM && this._activeIIIDM.isActive) {
      this._activeIIIDM.dispose();
    }

    this._activeIIIDM = newIIIDM;
  }
}
