import { GLTF } from 'three-stdlib';

export const RESOURCE_LOAD_STATUS = {
  ready: 'ready',
  loading: 'loading',
  completed: 'completed',
  failed: 'failed',
} as const;

type ResourceLoadStatus = keyof typeof RESOURCE_LOAD_STATUS;

// TODO: Add more resource types.
type ResourceType = GLTF;

export class Resource<TResourceType extends ResourceType> {
  private _data: TResourceType | null = null;
  private _loadStatus: ResourceLoadStatus = 'ready';
  private _loadProgress: number = 0;

  get data() {
    if (!this._data) throw new Error('Something has wrong, data is not exist.');

    return this._data;
  }

  changeData(data: TResourceType) {
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

  initialize() {
    this._data = null;
    this._loadStatus = RESOURCE_LOAD_STATUS.ready;
    this._loadProgress = 0;
  }
}
