import {
  AxesHelper,
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

import { IIIDMCore } from './IIIDMCore';
import { IIIDMLogWorker } from './IIIDMLogWorker';
import {
  AnimationManager,
  ControlManager,
  FrameManager,
  ResourceManager,
  ShaderManager,
} from './managers';
import { FramePerSecond } from './managers/FrameManager';

type CameraMap = {
  key: string;
  isActive: boolean;
  object: PerspectiveCamera;
};

type SceneMap = {
  key: string;
  isActive: boolean;
  object: Scene;
};

type Object3dType = 'mesh' | 'light' | 'helper' | 'resource';

type Object3DMap = {
  type: Object3dType;
  key: string;
  object: Object3D<Object3DEventMap>;
};

/**
 * NOTE: IIIDM is a class that manages the entire 3D scene.
 * - When constructing, if you have a IIIDMCore instance, you can pass it as an argument. (Make IIIDMCore as singleton.)
 * - As a result, IIIDMCore can reference only one IIIDM instance.
 * - Please using environment variable for set isDevMode. On isDevelopMode is true, all of loggers will be working. if not, all of loggers will not be working except for error logger.
 * - Additionally, default isDevMode is true.
 * - This class is abtract class, so you must inherit this class for make some 3D scene.
 * - When a class that inherited this class are activated, IIIDMCore will reference that IIIDM instance.
 * - When a class that inherited this class are deactivated, IIIDMCore will stop update that IIIDM instance. (And, related managers will be deactivated.)
 * - When a class that inherited this class are disposed, IIIDMCore will not reference that IIIDM instance.
 * - When you want to make some other features on IIIDM instance, please using managers.
 * TODO: Total log system should be implemented with structured ErrorClass.
 */
export abstract class IIIDM {
  protected canvas: HTMLCanvasElement;
  protected renderer: WebGLRenderer;
  protected _activeCamera: PerspectiveCamera;
  protected _activeScene: Scene;
  protected activeCore: IIIDMCore;
  protected activeAnimationManager: AnimationManager;
  protected activeControlManager: ControlManager;
  protected activeFrameManager: FrameManager;
  protected activeResourceManager: ResourceManager;
  protected activeShaderManager: ShaderManager;
  protected logWorker: IIIDMLogWorker<this>;
  protected cameraMaps: CameraMap[] = [];
  protected sceneMaps: SceneMap[] = [];
  protected object3DMaps: Object3DMap[] = [];
  protected _isActive: boolean = false;
  protected _isCanvasAppended: boolean = false;
  protected _fps: FramePerSecond;
  protected _isDevMode: boolean;

  constructor(_activeCore?: IIIDMCore, _isDevMode?: boolean) {
    this._isDevMode = _isDevMode ?? true;

    this.activeCore = _activeCore || new IIIDMCore(this._isDevMode);

    this.canvas = this.activeCore.canvas;
    this.renderer = this.activeCore.renderer;

    const camera = new PerspectiveCamera(50, 1, 0.1, 1000);
    const scene = new Scene();

    this.cameraMaps = [...this.cameraMaps, { key: 'default', isActive: true, object: camera }];
    this.sceneMaps = [...this.sceneMaps, { key: 'default', isActive: true, object: scene }];

    this._activeCamera = camera;
    this._activeScene = scene;

    // NOTE: Add all events for work as devmode.
    if (this._isDevMode) {
      const axesHelper = new AxesHelper(1000);

      this.object3DMaps = [
        ...this.object3DMaps,
        { key: 'axes', type: 'helper', object: axesHelper },
      ];

      this._activeScene.add(...this.object3DMaps.map(object3DMap => object3DMap.object));
    }

    this.activeAnimationManager = this.activeCore.animationManager;
    this.activeControlManager = this.activeCore.controlManager;
    this.activeFrameManager = this.activeCore.frameManager;
    this.activeResourceManager = this.activeCore.resourceManager;
    this.activeShaderManager = this.activeCore.shaderManager;
    this.logWorker = new IIIDMLogWorker(this, this._isDevMode);
    this._fps = this.activeCore.frameManager.fps;
  }

  get activeCamera() {
    return this._activeCamera;
  }

  set activeCamera(camera: PerspectiveCamera) {
    this._activeCamera = camera;
  }

  get activeScene() {
    return this._activeScene;
  }

  set activeScene(scene: Scene) {
    this._activeScene = scene;
  }

  get isActive() {
    return this._isActive;
  }

  get isCanvasAppended() {
    return this._isCanvasAppended;
  }

  get fps() {
    return this._fps;
  }

  get isDevMode() {
    return this._isDevMode;
  }

  /**
   * NOTE: Activate IIIDM instance.
   * - Check status for run core. (And all of managers.)
   * - If IIIDM instance is not initialized, run initialize method.
   * - Run update method.
   */
  activate() {
    if (this._isActive) return;

    if (!this.isCanvasAppended) this.logWorker.error('Canvas is not appended.');

    this._isActive = true;

    // NOTE: When IIIDM instance is changed, IIIDMCore will clear all managers.
    if (this.activeCore.activeIIIDM !== this) {
      this.activeCore.changeIIIDM(this);
    }

    if (this.initialize) {
      this.activeFrameManager.setFrameInitializeAction(this.initialize.bind(this));
    }

    this.activeFrameManager.setFrameUpdateAction(this.update?.bind(this));

    this.activeCore.activateManager();
  }

  /**
   * NOTE: Deactivate IIIDM instance.
   * - Deactivate all managers.
   */
  deactivate() {
    if (!this._isActive) return;

    this._isActive = false;

    this.activeCore.deactivateManager();
  }

  /**
   * NOTE: Absolutely clear IIIDM instance.
   * - Deactivate IIIDM instance.
   * - Deactivate all managers.
   * - Dispose renderer.
   */
  dispose() {
    this.deactivate();
    this.activeCore.clearManager();
    this.renderer.dispose();
  }

  appendCanvasTo(target: HTMLElement) {
    target.appendChild(this.canvas);

    this._isCanvasAppended = true;
    this.onResize();
  }

  /** NOTE: This method will be called when window is resized. */
  onResize() {
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);

    this._activeCamera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this._activeCamera.updateProjectionMatrix();

    this.renderer.render(this._activeScene, this._activeCamera);
  }

  /**
   * NOTE: This method will be called only once.
   */
  protected async initialize?(): Promise<void>;

  /**
   * NOTE: This method will be called every frame.
   * - Must execute renderer.render() method after doing something.
   */
  protected abstract update(): void;
}
