import { GLTF, GLTFLoader, DRACOLoader, KTX2Loader, MeshoptDecoder } from 'three-stdlib';

import { IIIDMWorker, LogWorker } from '.';

import { IIIDM } from '@/IIIDM';

export type OnLoadProgressAction = (percentage: number) => void;

export type OnLoadCompleteAction = () => void;

const RESOURCE_LOAD_STATUS = {
  initialize: 'initialize',
  loading: 'loading',
  completed: 'completed',
  failed: 'failed',
} as const;

type ResourceLoadStatus = keyof typeof RESOURCE_LOAD_STATUS;

// TODO: Add more resource types.
type ResourceType = GLTF;

export class Resource<TResourceType extends ResourceType> {
  private _data: TResourceType | null = null;
  private _loadStatus: ResourceLoadStatus = 'initialize';
  private _loadProgress: number = 0;

  get data() {
    if (!this._data) throw new Error('Resource is not yet loaded.');

    return this._data;
  }

  set data(data: TResourceType) {
    this._data = data;
  }

  get loadStatus() {
    return this._loadStatus;
  }

  set loadStatus(status: ResourceLoadStatus) {
    this._loadStatus = status;
  }

  get loadProgress() {
    return this._loadProgress;
  }

  set loadProgress(progress: number) {
    this._loadProgress = progress;
  }

  clear() {
    this._data = null;
    this._loadStatus = 'initialize';
    this._loadProgress = 0;
  }
}

export class ResourceWorker extends IIIDMWorker {
  private gltfLoader: GLTFLoader;
  private logWorker: LogWorker<this>;
  private _onLoadProgressAction: OnLoadProgressAction | null = null;
  private _onLoadCompleteAction: OnLoadCompleteAction | null = null;

  constructor(maker: IIIDM) {
    super(maker);

    this.logWorker = new LogWorker(maker, this);

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

    ktx2Loader.detectSupport(this.maker.activeCore.renderer);
    ktx2Loader.setTranscoderPath('https://cdn.jsdelivr.net/gh/pmndrs/drei-assets@master/basis/');

    return ktx2Loader;
  }

  private onLoadProgress(xhr: ProgressEvent<EventTarget>) {
    const loadProgress = Math.ceil((xhr.loaded / xhr.total) * 100);

    if (this._onLoadProgressAction) this._onLoadProgressAction(loadProgress);

    this.logWorker.info(`Resource load progress: ${loadProgress}%`);

    if (loadProgress === 100) {
      if (this._onLoadCompleteAction) this._onLoadCompleteAction();
      this.logWorker.info('Resource load completed.');
    }
  }

  async loadResource(url: string) {
    try {
      return await this.gltfLoader.loadAsync(url, this.onLoadProgress.bind(this));
    } catch (error) {
      throw this.logWorker.error('Failed to load GLTF.', error);
    }
  }
}
