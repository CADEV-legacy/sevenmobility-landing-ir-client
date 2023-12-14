import { GLTF, GLTFLoader, DRACOLoader, KTX2Loader, MeshoptDecoder } from 'three-stdlib';

import { RESOURCE_LOAD_STATUS, Resource } from './Resource';

import { IIIDMCore } from '@/IIIDM/IIIDMCore';
import { IIIDMManager } from '@/IIIDM/IIIDMManager';

/**
 * NOTE: ResourceLoader is a class that manages resources.
 * - ResourceLoader is a singleton class.
 * - ResourceLoader is constrcuted in IIIDMCore.
 */
export class ResourceManager extends IIIDMManager {
  private gltfLoader: GLTFLoader;
  private resource: Resource<GLTF>;

  constructor(core: IIIDMCore) {
    super(core);

    this.resource = new Resource<GLTF>();
    this.resource.changeLoadStatus(RESOURCE_LOAD_STATUS.ready);

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

  activate() {
    this.onActivate();
  }

  deactivate() {
    this.onDeactivate();
  }

  clear() {
    this.onClear();

    this.resource.clear();
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

    if (loadProgress === 100) {
      this.resource.changeLoadStatus(RESOURCE_LOAD_STATUS.completed);
      this.logWorker.info('Resource load completed.');
    } else if (this.resource.loadStatus !== RESOURCE_LOAD_STATUS.loading) {
      this.resource.changeLoadStatus(RESOURCE_LOAD_STATUS.loading);
    }

    this.resource.changeLoadProgress(loadProgress);
    this.logWorker.info(`Resource load progress: ${loadProgress}%`);
  }

  async loadResource(url: string) {
    try {
      const gltfResource = await this.gltfLoader.loadAsync(url, this.onLoadProgress.bind(this));

      this.resource.data = gltfResource;
    } catch (error) {
      this.logWorker.error('Failed to load GLTF.', error);
    }
  }

  getResource() {
    if (
      this.resource.loadStatus !== RESOURCE_LOAD_STATUS.completed ||
      this.resource.loadProgress !== 100 ||
      !this.resource.data
    ) {
      this.logWorker.error('Resource is not loaded.');
    }

    return { ...this.resource };
  }
}
