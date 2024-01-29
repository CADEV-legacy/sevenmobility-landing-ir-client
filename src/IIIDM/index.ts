import {
  AxesHelper,
  CameraHelper,
  GridHelper,
  Mesh,
  Object3D,
  Object3DEventMap,
  PerspectiveCamera,
  Scene,
  WebGLRenderer,
} from 'three';

import { IIIDMCore } from './IIIDMCore';

import {
  AnimationManager,
  ControlManager,
  FrameManager,
  GUIManager,
  ShaderManager,
} from '@/IIIDM/managers';
import { LogWorker, PhysicsWorker, ResourceWorker } from '@/IIIDM/workers';

// NOTE: Default keys of camera and scene.
export const DEFAULT_CAMERA_NAME = 'defaultCamera' as const;
export const DEFAULT_SCENE_NAME = 'defaultScene' as const;

// NOTE: Default keys of helpers.
export const AXES_HELPER_NAME = 'axesHelper' as const;
export const GRID_HELPER_NAME = 'gridHelper' as const;
export const CAMERA_HELPER_NAME = 'cameraHelper' as const;

export const EMPTY_STRING = '';

/**
 * NOTE: IIIDM is a class that manages the entire 3D scene.
 * - When constructing, IIIDMCore instance is required.
 * - As a result, IIIDMCore can reference only one IIIDM instance.
 * - Please using environment variable for set isDevMode. On isDevelopMode is true, all of loggers will be working. if not, all of loggers will not be working except for error logger. (additionally, default isDevMode is true.)
 * - Default camera and scene are created when IIIDM instance is constructed. (which named starts with 'default')
 * - This class is abtract class, so you must inherit this class for make some 3D scene.
 * - When a class that inherited this class are activated, using onActivate function. then, IIIDMCore will reference that IIIDM instance.
 * - When a class that inherited this class are deactivated, using onDeactivate function. then, IIIDMCore will stop update that IIIDM instance. (And, related managers will be deactivated.)
 * - When a class that inherited this class are disposed, using onDispose function. then, IIIDMCore will not reference that IIIDM instance.
 * - When you want to make some other features on IIIDM instance, please using related managers.
 * TODO: Total log system should be implemented with structured ErrorClass.
 */
export abstract class IIIDM {
  // NOTE: Managers.
  private _animationManager: AnimationManager;
  private _controlManager: ControlManager;
  private _frameManager: FrameManager;
  private _GUIManager: GUIManager;
  private _shaderManager: ShaderManager;

  // NOTE: Workers.
  private _logWorker: LogWorker<this>;
  private _physicsWorker: PhysicsWorker;
  private _resourceWorker: ResourceWorker;

  // NOTE: Registered objects that maintain singletone.
  private _registeredCameras: PerspectiveCamera[] = [];
  private _registeredScenes: Scene[] = [];

  // NOTE: Active objects. (One of registered objects.)
  private _activeCore: IIIDMCore;
  private _activeCamera: PerspectiveCamera;
  private _activeScene: Scene;

  // NOTE: Essential properties.
  private _canvas: HTMLCanvasElement;
  private _renderer: WebGLRenderer;

  // NOTE: Flags.
  private _isActive: boolean = false;
  private _isInitialized: boolean = true;
  private _isDevMode: boolean;
  private _isCanvasAppended: boolean = false;

  constructor(_activeCore: IIIDMCore) {
    this._activeCore = _activeCore;
    this._isDevMode = this._activeCore.isDevMode;

    this._canvas = this._activeCore.canvas;
    this._renderer = this._activeCore.renderer;

    const defaultCamera = new PerspectiveCamera(50, 1, 0.1, 1000);

    defaultCamera.name = DEFAULT_CAMERA_NAME;

    const defaultScene = new Scene();

    defaultScene.name = DEFAULT_SCENE_NAME;

    this._registeredScenes = [defaultScene];
    this._registeredCameras = [defaultCamera];

    this._activeCamera = defaultCamera;
    this._activeScene = defaultScene;

    this._animationManager = new AnimationManager(this);
    this._controlManager = new ControlManager(this);
    this._frameManager = new FrameManager(this);
    this._GUIManager = new GUIManager(this);
    this._shaderManager = new ShaderManager(this);
    this._logWorker = new LogWorker(this, this);
    this._physicsWorker = new PhysicsWorker(this);
    this._resourceWorker = new ResourceWorker(this);

    // NOTE: Add all events at here for work as devmode.
    if (this._isDevMode) {
      const axesHelper = new AxesHelper(1000);

      axesHelper.name = AXES_HELPER_NAME;
      // NOTE: Set axesHelper colors as x - R, y - B,  z - Y.
      axesHelper.setColors('#FF0000', '#0000FF', '#FFFF00');

      const gridHelper = new GridHelper(1000, 1000);

      gridHelper.name = GRID_HELPER_NAME;

      const cameraHelper = new CameraHelper(this._activeCamera);

      cameraHelper.name = CAMERA_HELPER_NAME;

      this.addObjectsToScene(true, axesHelper, gridHelper, cameraHelper);
    }
  }

  // NOTE: Getters for managers.
  get animationManager() {
    return this._animationManager;
  }

  get controlManager() {
    return this._controlManager;
  }

  get frameManager() {
    return this._frameManager;
  }

  get GUIManager() {
    return this._GUIManager;
  }

  get shaderManager() {
    return this._shaderManager;
  }

  // NOTE: Getters for workers.
  get logWorker() {
    return this._logWorker;
  }

  get physicsWorker() {
    return this._physicsWorker;
  }

  get resourceWorker() {
    return this._resourceWorker;
  }

  // NOTE: Getters for registered objects.
  get registeredCameras() {
    return this._registeredCameras;
  }

  get registeredScenes() {
    return this._registeredScenes;
  }

  // NOTE: Getters for active objects.
  get activeCore() {
    return this._activeCore;
  }

  get activeCamera() {
    return this._activeCamera;
  }

  get activeScene() {
    return this._activeScene;
  }

  // NOTE: Getters for essential properties.
  get canvas() {
    return this._canvas;
  }

  get renderer() {
    return this._renderer;
  }

  // NOTE: Getters for flags.
  get isActive() {
    return this._isActive;
  }

  get isInitialized() {
    return this._isInitialized;
  }

  get isDevMode() {
    return this._isDevMode;
  }

  get isCanvasAppended() {
    return this._isCanvasAppended;
  }

  private initialize() {
    // NOTE: Add all events at here for work as devmode.
    if (this._isDevMode) {
      const axesHelper = new AxesHelper(1000);

      axesHelper.name = AXES_HELPER_NAME;
      // NOTE: Set axesHelper colors as x - R, y - B,  z - Y.
      axesHelper.setColors('#FF0000', '#0000FF', '#FFFF00');

      const gridHelper = new GridHelper(1000, 1000);

      gridHelper.name = GRID_HELPER_NAME;

      const cameraHelper = new CameraHelper(this._activeCamera);

      cameraHelper.name = CAMERA_HELPER_NAME;

      this.addObjectsToScene(true, axesHelper, gridHelper, cameraHelper);
    }
  }

  /** NOTE: Must use this function when you remove some object from scene. */
  private disposeObject(object: Object3D<Object3DEventMap>) {
    if (object instanceof Mesh) {
      object.geometry.dispose();
      object.material.dispose();
    }

    object.clear();
  }

  deactivateManagers() {
    this._animationManager.deactivate();
    this._controlManager.deactivate();
    this._frameManager.deactivate();
    this._GUIManager.deactivate();
    this._shaderManager.deactivate();
  }

  clearManagers() {
    this._animationManager.clear();
    this._controlManager.clear();
    this._frameManager.clear();
    this._GUIManager.clear();
    this._shaderManager.clear();
  }

  /**
   * NOTE: When you want to add objects to scene, please using this method.
   * - If you want to render after adding objects, please set isNeedRender as true.
   * - Must set object name. (If not, it will be throw error.)
   * - If you add object that has same name with other object, it will be replaced.
   * - Other objects will be added to scene.
   */
  addObjectsToScene(isNeedRender: boolean, ...objects: Object3D<Object3DEventMap>[]) {
    objects.forEach(object => {
      if (object.name === EMPTY_STRING) throw this._logWorker.error('Object name is empty.');

      const duplicatedObjectIndex = this._activeScene.children.findIndex(
        child => child.name === object.name
      );

      if (duplicatedObjectIndex !== -1) {
        this._activeCamera.children[duplicatedObjectIndex] = object;

        return;
      }

      this._activeScene.add(object);
    });

    if (isNeedRender) this.render();
  }

  /**
   * NOTE: When you want to remove objects from scene, please using this method.
   * - If you want to render after removing objects, please set isNeedRender as true.
   * - If name is not exist, it will be throw error.
   * - When you remove object, it will be disposed including children object.
   */
  removeObjectsFromScene(isNeedRender: boolean, ...names: string[]) {
    names.forEach(name => {
      const targetObject = this._activeScene.getObjectByName(name);

      if (!targetObject)
        throw this._logWorker.error(`Object name with ${name} is not exist. can't remove it.`);

      this._activeScene.remove(targetObject);
    });

    if (isNeedRender) this.render();
  }

  /**
   * NOTE: When you want to change active camera, just using this.
   * - If name is not exist, it will be throw error.
   * - When you change active camera, exist active camera will be removed from scene. and new active camera will be added to scene.
   * - Automatically, render will be called.
   */
  changeActiveCameraTo(name: string) {
    const cameraIndex = this._registeredCameras.findIndex(camera => camera.name === name);

    if (cameraIndex === -1) throw this._logWorker.error(`Camera name with ${name} is not exist.`);

    this.removeObjectsFromScene(false, this._activeCamera.name);

    this._activeCamera = this._registeredCameras[cameraIndex];
  }

  /**
   * NOTE: When you want to add or update camera, just using this.
   * - If name is not exist, it will be throw error.
   * - When your new camera has same name with other camera, it will be replaced.
   * - If not, it will be added to registered cameras.
   */
  registerCamera(camera: PerspectiveCamera) {
    if (camera.name === EMPTY_STRING) throw this._logWorker.error('Camera name is required.');

    const duplicatedCameraIndex = this._registeredCameras.findIndex(
      registeredCamera => registeredCamera.name === camera.name
    );

    if (duplicatedCameraIndex !== -1) {
      this._registeredCameras[duplicatedCameraIndex] = camera;

      return;
    }

    this._registeredCameras.push(camera);
  }

  /**
   * NOTE: When you want to change active scene, just using this.
   * - If name is not exist, it will be throw error.
   * - If you want to render after changing active scene, please set isNeedRender as true.
   */
  changeActiveSceneTo(name: string, isNeedRender: boolean) {
    const sceneIndex = this._registeredScenes.findIndex(scene => scene.name === name);

    if (sceneIndex === -1) throw this._logWorker.error(`Scene name with ${name} is not exist.`);

    this._activeScene = this._registeredScenes[sceneIndex];

    if (isNeedRender) this.render();
  }

  /**
   * NOTE: When you want to add or update scene, just using this.
   * - If name is not exist, it will be throw error.
   * - When your new scene has same name with other scene, it will be replaced.
   * - If not, it will be added to registered scenes.
   */
  registerScene(scene: Scene) {
    if (scene.name === EMPTY_STRING) throw this._logWorker.error('Scene name is required.');

    const duplicatedSceneIndex = this._registeredScenes.findIndex(
      registeredScene => registeredScene.name === scene.name
    );

    if (duplicatedSceneIndex !== -1) {
      this._registeredScenes[duplicatedSceneIndex].traverse(this.disposeObject);
      this._registeredScenes[duplicatedSceneIndex] = scene;

      return;
    }

    this._registeredScenes.push(scene);
  }

  /** NOTE: When IIIDM instance is used, must using this function to append canvas to target. */
  appendCanvasTo(target: HTMLElement) {
    target.appendChild(this.canvas);

    this._isCanvasAppended = true;
    this.resize();
  }

  protected onResize() {
    this._activeCamera.aspect = this._canvas.clientWidth / this._canvas.clientHeight;
    this._activeCamera.updateProjectionMatrix();

    this._renderer.setSize(this._canvas.clientWidth, this._canvas.clientHeight, false);
  }

  protected onRender() {
    this._renderer.render(this._activeScene, this._activeCamera);
  }

  protected onActivate() {
    if (this._isActive) throw this._logWorker.error('IIIDM instance is already activated.');

    if (!this._isCanvasAppended) throw this._logWorker.error('Canvas is not appended.');

    if (this._isInitialized) this._isInitialized = false;

    this._isActive = true;

    this._activeCore.changeIIIDM(this);

    if (this._isDevMode) {
      this._GUIManager.initialize();
      this._GUIManager.activate();
    }
  }

  protected onDeactivate() {
    if (!this._isActive) throw this._logWorker.error('IIIDM instance is not activated.');

    this._isActive = false;

    this.deactivateManagers();
  }

  protected onDispose() {
    if (this._isActive) this._isActive = false;

    this._registeredScenes.map(scene => {
      scene.traverse(this.disposeObject);
      scene.clear();
    });
    this._registeredCameras.map(camera => {
      camera.traverse(this.disposeObject);
      camera.clear();
    });
    this.clearManagers();
    this._renderer.renderLists.dispose();
    this._renderer.dispose();
    this._renderer.clear();

    if (!this.isInitialized) {
      this._logWorker.info('IIIDM instance has some changes. and initialize all of them.');
      this.initialize();
      this._isInitialized = true;
    }
  }

  // NOTE: Essential methods for using IIIDM instance.
  /** NOTE: Using onResize before declare other things. */
  abstract resize(): void;
  /** NOTE: Using onRender before declare other things. */
  abstract render(): void;
  /** NOTE: Using onActivate before declare other things. */
  abstract activate(): void;
  /** NOTE: Using onDeactivate before declare other things. */
  abstract deactivate(): void;
  /** NOTE: Using onDispose before declare other things. */
  abstract dispose(): void;
}

export { IIIDMCore };
