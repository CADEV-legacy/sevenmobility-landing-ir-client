import {
  PCFSoftShadowMap,
  PerspectiveCamera,
  ReinhardToneMapping,
  SRGBColorSpace,
  Scene,
  WebGLRenderer,
} from 'three';

import { IIIDM } from '.';
import {
  AnimationManager,
  ControlManager,
  EffectManager,
  FrameManager,
  GUIManager,
  ResourceManager,
  ShaderManager,
} from './managers';

/**
 * NOTE: Save singleton properties in this class.
 * 1. IIIDMCore is a singleton class.
 * 2. That means, only one IIIDMCore instance is alive in one project.
 * 3. This class is includes all managers and renderer. (Then, all managers and renderer are singleton.)
 */
export class IIIDMCore {
  private _canvas: HTMLCanvasElement;
  private _renderer: WebGLRenderer;
  private _activeCamera: PerspectiveCamera | null = null;
  private _activeScene: Scene | null = null;
  private _activeIIIDM: IIIDM | null = null;
  private _animationManager: AnimationManager;
  private _controlManager: ControlManager;
  private _effectManager: EffectManager;
  private _frameManager: FrameManager;
  private _guiManager: GUIManager;
  private _resourceManager: ResourceManager;
  private _shaderManager: ShaderManager;
  private _isDevMode: boolean;

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

    this._animationManager = new AnimationManager(this);
    this._controlManager = new ControlManager(this);
    this._effectManager = new EffectManager(this);
    this._frameManager = new FrameManager(this);
    this._guiManager = new GUIManager(this);
    this._resourceManager = new ResourceManager(this);
    this._shaderManager = new ShaderManager(this);
  }

  get canvas() {
    return this._canvas;
  }

  get renderer() {
    return this._renderer;
  }

  get animationManager() {
    return this._animationManager;
  }

  get controlManager() {
    return this._controlManager;
  }

  get effectManager() {
    return this._effectManager;
  }

  get frameManager() {
    return this._frameManager;
  }

  get guiManager() {
    return this._guiManager;
  }

  get resourceManager() {
    return this._resourceManager;
  }

  get shaderManager() {
    return this._shaderManager;
  }

  get isDevMode() {
    return this._isDevMode;
  }

  get activeIIIDM() {
    return this._activeIIIDM;
  }

  get activeCamera() {
    return this._activeCamera;
  }

  get activeScene() {
    return this._activeScene;
  }

  /** NOTE: When this method is working, dispose activeIIIDM and clear all managers. */
  changeIIIDM(newIIIDM: IIIDM) {
    if (this._activeIIIDM && this._activeIIIDM !== newIIIDM && newIIIDM.isActive)
      this._activeIIIDM.dispose();

    if (this._activeIIIDM && this._activeIIIDM !== newIIIDM) this.initializeManager();

    this._activeIIIDM = newIIIDM;
    this._activeCamera = newIIIDM.activeCamera;
    this._activeScene = newIIIDM.activeScene;
  }

  deactivateManager() {
    this._animationManager.deactivate();
    this._controlManager.deactivate();
    this._effectManager.deactivate();
    this._frameManager.deactivate();
    this._guiManager.deactivate();
    this._resourceManager.deactivate();
    this._shaderManager.deactivate();
  }

  initializeManager() {
    this._animationManager.initialize();
    this._controlManager.initialize();
    this._effectManager.initialize();
    this._frameManager.initialize();
    this._guiManager.initialize();
    this._resourceManager.initialize();
    this._shaderManager.initialize();
  }
}
