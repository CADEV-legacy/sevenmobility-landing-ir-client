import { GLTF, GLTFLoader, DRACOLoader, KTX2Loader, MeshoptDecoder } from 'three-stdlib';

import { RESOURCE_LOAD_STATUS, Resource } from './Resource';

import { IIIDMCore } from '@/IIIDM/IIIDMCore';
import { IIIDMManager } from '@/IIIDM/IIIDMManager';

export type OnLoadProgressAction = (percentage: number) => void;

export type OnLoadCompleteAction = () => void;

/**
 * NOTE: ResourceLoader is a class that manages resources.
 * - ResourceLoader is a singleton class.
 * - ResourceLoader is constrcuted in IIIDMCore.
 */
export class ResourceManager extends IIIDMManager {
  private gltfLoader: GLTFLoader;
  private _resource: Resource<GLTF>;
  private _onLoadProgressAction: OnLoadProgressAction | null = null;
  private _onLoadCompleteAction: OnLoadCompleteAction | null = null;

  constructor(core: IIIDMCore) {
    super(core);

    this._resource = new Resource<GLTF>();
    this._resource.loadStatus = RESOURCE_LOAD_STATUS.ready;

    const gltfLoader = new GLTFLoader();

    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/');

    gltfLoader
      .setCrossOrigin('anonymous')
      .setDRACOLoader(this.getDracoLoader())
      .setKTX2Loader(this.getKTX2Loader())
      .setMeshoptDecoder(typeof MeshoptDecoder === 'function' ? MeshoptDecoder() : MeshoptDecoder);

    this.gltfLoader = gltfLoader;
  }

  get resource() {
    if (!this._resource.data) {
      throw this.logWorker.error('Before get resource, please load resource.');
    }

    return this._resource;
  }

  set onLoadProgressAction(action: OnLoadProgressAction) {
    this._onLoadProgressAction = action;
  }

  set onLoadCompleteAction(action: OnLoadCompleteAction) {
    this._onLoadCompleteAction = action;
  }

  private getDracoLoader() {
    const dracoLoader = new DRACOLoader();

    dracoLoader.setDecoderPath('https://www.gstatic.com/draco/versioned/decoders/1.4.3/');

    return dracoLoader;
  }

  private getKTX2Loader() {
    const ktx2Loader = new KTX2Loader();

    ktx2Loader.detectSupport(this.core.renderer);
    ktx2Loader.setTranscoderPath('https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/basis/');

    return ktx2Loader;
  }

  private onLoadProgress(xhr: ProgressEvent<EventTarget>) {
    const loadProgress = Math.ceil((xhr.loaded / xhr.total) * 100);

    if (this._onLoadProgressAction) this._onLoadProgressAction(loadProgress);

    if (loadProgress !== 100 && this._resource.loadStatus !== RESOURCE_LOAD_STATUS.loading) {
      this._resource.loadStatus = RESOURCE_LOAD_STATUS.loading;
    }

    if (loadProgress === this._resource.loadProgress) return;

    this._resource.loadProgress = loadProgress;
    this.logWorker.info(`Resource load progress: ${loadProgress}%`);

    if (loadProgress === 100) {
      if (this._onLoadCompleteAction) this._onLoadCompleteAction();
      this._resource.loadStatus = RESOURCE_LOAD_STATUS.completed;
      this.logWorker.info('Resource load completed.');
    }
  }

  async loadResource(url: string) {
    if (!this.isActive) {
      throw this.logWorker.error('ResourceManager is not activated.');
    }

    try {
      this._resource.changeData(
        await this.gltfLoader.loadAsync(url, this.onLoadProgress.bind(this))
      );
    } catch (error) {
      this._resource.loadStatus = RESOURCE_LOAD_STATUS.failed;

      throw this.logWorker.error('Failed to load GLTF.', error);
    }
  }

  activate() {
    this.onActivate();
  }

  deactivate() {
    this.onDeactivate();
  }

  initialize() {
    this.onInitialize();

    this._resource.initialize();
    this._onLoadProgressAction = null;
    this._onLoadCompleteAction = null;
  }
}
