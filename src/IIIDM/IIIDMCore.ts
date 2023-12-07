import { PCFSoftShadowMap, SRGBColorSpace, WebGLRenderer } from 'three';

import { IIIDM } from './IIIDM';

export class IIIDMCore {
  private canvas: HTMLCanvasElement;
  private renderer: WebGLRenderer;

  private activeIIIDM: IIIDM | null = null;

  constructor() {
    this.renderer = new WebGLRenderer({
      antialias: true,
      preserveDrawingBuffer: true,
      alpha: true,
    });

    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.renderer.outputColorSpace = SRGBColorSpace;

    this.canvas = this.renderer.domElement;

    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    // TODO: Add resource handlers.
  }

  getCanvas() {
    return this.canvas;
  }

  getRenderer() {
    return this.renderer;
  }

  changeIIIDM(newIIIDM: IIIDM) {
    if (this.activeIIIDM && this.activeIIIDM !== newIIIDM && newIIIDM.getStatus())
      this.activeIIIDM.deactivate();

    this.activeIIIDM = newIIIDM;
  }
}
