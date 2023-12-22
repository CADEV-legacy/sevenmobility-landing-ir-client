import {
  AxesHelper,
  CameraHelper,
  GridHelper,
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
  EffectManager,
  FrameManager,
  FramePerSecond,
  GUIManager,
  ResourceManager,
  ShaderManager,
} from './managers';

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

type Object3dType = 'camera' | 'light' | 'helper' | 'mesh' | 'resource';

type Object3DMap = {
  type: Object3dType;
  key: string;
  object: Object3D<Object3DEventMap>;
};

export const DEFAULT_CAMERA_KEY = 'defaultCamera' as const;
export const DEFAULT_SCENE_KEY = 'defaultScene' as const;
export const AXES_HELPER_KEY = 'axesHelper' as const;
export const GRID_HELPER_KEY = 'gridHelper' as const;
export const CAMERA_HELPER_KEY = 'cameraHelper' as const;

/**
 * NOTE: IIIDM is a class that manages the entire 3D scene.
 * - When constructing, if you have a IIIDMCore instance, you can pass it as an argument. (Make IIIDMCore as singleton.)
 * - As a result, IIIDMCore can reference only one IIIDM instance.
 * - Please using environment variable for set isDevMode. On isDevelopMode is true, all of loggers will be working. if not, all of loggers will not be working except for error logger. additionally, default isDevMode is true.
 * - Default camera and scene are created when IIIDM instance is constructed. (which named 'default')
 * - This class is abtract class, so you must inherit this class for make some 3D scene.
 * - When a class that inherited this class are activated, using onActivate function. then, IIIDMCore will reference that IIIDM instance.
 * - When a class that inherited this class are deactivated, using onDeactivate function. then, IIIDMCore will stop update that IIIDM instance. (And, related managers will be deactivated.)
 * - When a class that inherited this class are disposed, using onDispose function. then, IIIDMCore will not reference that IIIDM instance.
 * - When you want to make some other features on IIIDM instance, please using related managers.
 * TODO: Total log system should be implemented with structured ErrorClass.
 */
export abstract class IIIDM {
  protected canvas: HTMLCanvasElement;
  protected renderer: WebGLRenderer;
  protected activeCore: IIIDMCore;
  protected activeAnimationManager: AnimationManager;
  protected activeControlManager: ControlManager;
  protected activeEffectManager: EffectManager;
  protected activeFrameManager: FrameManager;
  protected activeGUIManager: GUIManager;
  protected activeResourceManager: ResourceManager;
  protected activeShaderManager: ShaderManager;
  protected logWorker: IIIDMLogWorker<this>;
  protected cameraMaps: CameraMap[] = [];
  protected sceneMaps: SceneMap[] = [];
  protected object3DMaps: Object3DMap[] = [];
  protected isCanvasAppended: boolean = false;
  protected fps: FramePerSecond;
  protected isDevMode: boolean;

  private _activeCamera: PerspectiveCamera;
  private _activeScene: Scene;
  private _isActive: boolean = false;
  private _isInitialized: boolean = true;

  constructor(_activeCore: IIIDMCore) {
    this.activeCore = _activeCore;
    this.isDevMode = this.activeCore.isDevMode;

    this.canvas = this.activeCore.canvas;
    this.renderer = this.activeCore.renderer;

    const camera = new PerspectiveCamera(50, 1, 0.1, 1000);
    const scene = new Scene();

    this.sceneMaps = [{ key: DEFAULT_SCENE_KEY, isActive: true, object: scene }];
    this.cameraMaps = [{ key: DEFAULT_CAMERA_KEY, isActive: true, object: camera }];
    this.changeObject3DMap({ key: DEFAULT_CAMERA_KEY, type: 'camera', object: camera });

    this._activeCamera = camera;
    this._activeScene = scene;

    // NOTE: Add all events at here for work as devmode.
    if (this.isDevMode) {
      const axesHelper = new AxesHelper(1000);

      // NOTE: Set axesHelper colors as x - R, y - B,  z - Y.
      axesHelper.setColors('#FF0000', '#0000FF', '#FFFF00');

      const gridHelper = new GridHelper(1000, 1000);
      const cameraHelper = new CameraHelper(this.activeCamera);

      this.changeObject3DMap([
        { key: AXES_HELPER_KEY, type: 'helper', object: axesHelper },
        { key: GRID_HELPER_KEY, type: 'helper', object: gridHelper },
        { key: CAMERA_HELPER_KEY, type: 'helper', object: cameraHelper },
      ]);
    }

    this.activeAnimationManager = this.activeCore.animationManager;
    this.activeControlManager = this.activeCore.controlManager;
    this.activeEffectManager = this.activeCore.effectManager;
    this.activeFrameManager = this.activeCore.frameManager;
    this.activeGUIManager = this.activeCore.guiManager;
    this.activeResourceManager = this.activeCore.resourceManager;
    this.activeShaderManager = this.activeCore.shaderManager;
    this.logWorker = new IIIDMLogWorker(this, this.isDevMode);
    this.fps = this.activeCore.frameManager.fps;
  }

  get activeCamera() {
    return this._activeCamera;
  }

  /** NOTE: Using this function when active camera has changed. */
  changeActiveCamera(newCameraMap: CameraMap) {
    const targetCameraMap = this.cameraMaps.find(cameraMap => cameraMap.key === newCameraMap.key);

    if (!targetCameraMap) {
      this.cameraMaps.push({ ...newCameraMap, isActive: true });
      this.changeObject3DMap({
        key: newCameraMap.key,
        type: 'camera',
        object: newCameraMap.object,
      });
      this._activeCamera = newCameraMap.object;
      this.logWorker.info('New camera is added.');

      return;
    }

    this.cameraMaps.map(cameraMap => (cameraMap.isActive = false));
    targetCameraMap.object = newCameraMap.object;
    targetCameraMap.isActive = true;
    this.changeObject3DMap({ key: newCameraMap.key, type: 'camera', object: newCameraMap.object });
    this._activeCamera = targetCameraMap.object;

    if (this.isDevMode) {
      const cameraHelper = new CameraHelper(this.activeCamera);

      this.changeObject3DMap({ key: CAMERA_HELPER_KEY, type: 'helper', object: cameraHelper });
    }
  }

  get activeScene() {
    return this._activeScene;
  }

  /** NOTE: Using this function when active scene has changed. */
  changeActiveScene(newSceneMap: SceneMap) {
    const targetSceneMap = this.sceneMaps.find(sceneMap => sceneMap.key === newSceneMap.key);

    if (!targetSceneMap) {
      this.sceneMaps.push({ ...newSceneMap, isActive: true });
      this.logWorker.info('New scene is added.');

      return;
    }

    this.sceneMaps.map(sceneMap => (sceneMap.isActive = false));
    targetSceneMap.object = newSceneMap.object;
    targetSceneMap.isActive = true;
    this._activeScene = targetSceneMap.object;

    this.changeActiveSceneObjects();
  }

  private changeActiveSceneObjects() {
    const activeSceneMap = this.sceneMaps.find(sceneMap => sceneMap.isActive);

    if (!activeSceneMap) {
      throw this.logWorker.error('Active scene is not exist.');
    }

    activeSceneMap.object.clear();
    activeSceneMap.object.add(...this.object3DMaps.map(object3DMap => object3DMap.object));
  }

  /** NOTE: Using this function when object3DMaps has changed. when this function is executed, automately add this object at active scene. */
  changeObject3DMap(props: Object3DMap | Object3DMap[]) {
    if (!Array.isArray(props)) {
      const isObject3DMapDuplicated = !!this.object3DMaps.find(
        object3DMap => object3DMap.key === props.key && object3DMap.type === props.type
      );

      if (isObject3DMapDuplicated) {
        this.object3DMaps.map(object3DMap => {
          if (object3DMap.key === props.key && object3DMap.type === props.type) {
            object3DMap.object = props.object;
          }
        });

        this.changeActiveSceneObjects();

        return;
      }

      this.object3DMaps.push(props);

      this.changeActiveSceneObjects();

      return;
    }

    const isObject3DMapsDuplicated = !!props.find(
      object3DMap =>
        !!this.object3DMaps.find(
          _object3DMap =>
            _object3DMap.key === object3DMap.key && _object3DMap.type === object3DMap.type
        )
    );

    if (isObject3DMapsDuplicated) {
      props.map(object3DMap => {
        this.object3DMaps.map(_object3DMap => {
          if (_object3DMap.key === object3DMap.key && _object3DMap.type === object3DMap.type) {
            _object3DMap.object = object3DMap.object;
          }
        });
      });

      this.changeActiveSceneObjects();

      return;
    }

    this.object3DMaps.push(...props);

    this.changeActiveSceneObjects();
  }

  get isActive() {
    return this._isActive;
  }

  get isInitialized() {
    return this._isInitialized;
  }

  private initialize() {
    const camera = new PerspectiveCamera(50, 1, 0.1, 1000);
    const scene = new Scene();

    this.sceneMaps = [{ key: 'default', isActive: true, object: scene }];
    this.changeObject3DMap({ key: 'mainCamera', type: 'camera', object: camera });

    this._activeCamera = camera;
    this._activeScene = scene;

    // NOTE: Add all events at here for work as devmode.
    if (this.isDevMode) {
      const axesHelper = new AxesHelper(1000);

      // NOTE: Set axesHelper colors as x - R, y - B,  z - Y.
      axesHelper.setColors('#FF0000', '#0000FF', '#FFFF00');

      const gridHelper = new GridHelper(1000);
      const cameraHelper = new CameraHelper(this._activeCamera);

      this.changeObject3DMap([
        { key: 'axes', type: 'helper', object: axesHelper },
        { key: 'grid', type: 'helper', object: gridHelper },
        { key: 'camera', type: 'helper', object: cameraHelper },
      ]);
    }
  }

  /** NOTE: When IIIDM instance is used, must using this function to append canvas to target. */
  appendCanvasTo(target: HTMLElement) {
    target.appendChild(this.canvas);

    this.isCanvasAppended = true;
    this.resize();
  }

  /** NOTE: At resize, must using this method. */
  protected onResize() {
    this.renderer.setSize(this.canvas.clientWidth, this.canvas.clientHeight, false);

    this._activeCamera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this._activeCamera.updateProjectionMatrix();

    this.render();
  }

  protected onRender() {
    this.renderer.render(this._activeScene, this._activeCamera);
  }

  /**
   * NOTE: At activate, must using this method.
   * - Check status for run core. (And all of managers.)
   * - If IIIDM instance is active, return.
   * - If canvas is not appended, throw error.
   * - When this method is called, _isInitialized will be false for check that this instance has been changed.
   */
  protected onActivate() {
    if (this._isActive) throw this.logWorker.error('IIIDM instance is already activated.');

    if (!this.isCanvasAppended) throw this.logWorker.error('Canvas is not appended.');

    if (this.isInitialized) this._isInitialized = false;

    this._isActive = true;

    // NOTE: When IIIDM instance is changed, IIIDMCore will clear all managers.
    if (this.activeCore.activeIIIDM !== this) {
      this.activeCore.changeIIIDM(this);
    }

    if (this.isDevMode) {
      this.activeGUIManager.activate();
    }
  }

  /**
   * NOTE: At deactivate, must using this method.
   * - Deactivate all managers.
   */
  protected onDeactivate() {
    if (!this._isActive) throw this.logWorker.error('IIIDM instance is not activated.');

    this._isActive = false;

    this.activeCore.deactivateManager();
  }

  /**
   * NOTE: At dispose, must using this method.
   * - Initialize all managers.
   * - Dispose renderer and renderLists.
   * - Clear active scene.
   * - Clear active camera.
   * - Initialize cameraMaps, sceneMaps, object3DMaps.
   */
  protected onDispose() {
    if (this._isActive) this._isActive = false;

    this.activeCore.initializeManager();
    this.renderer.renderLists.dispose();
    this.renderer.dispose();
    this.renderer.clear();
    this._activeScene.clear();
    this._activeCamera.clear();
    this.object3DMaps.map(object3DMap => object3DMap.object.clear());

    if (!this.isInitialized) {
      this.logWorker.info('IIIDM instance has some changes. and initialize all of them.');
      this.initialize();
      this._isInitialized = true;
    }
  }

  abstract resize(): void;

  abstract render(): void;

  abstract activate(): void;

  abstract deactivate(): void;

  abstract dispose(): void;
}
