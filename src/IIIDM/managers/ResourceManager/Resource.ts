export const RESOURCE_LOAD_STATUS = {
  ready: 'ready',
  registered: 'registered',
  loading: 'loading',
  completed: 'completed',
  failed: 'failed',
} as const;

type ResourceLoadStatus = keyof typeof RESOURCE_LOAD_STATUS;

export class Resource<ResourceType = unknown> {
  data: ResourceType | null = null;
  private _loadStatus: ResourceLoadStatus = 'ready';
  private _loadProgress: number = 0;

  constructor() {}

  get loadStatus() {
    return this._loadStatus;
  }

  get loadProgress() {
    return this._loadProgress;
  }

  changeLoadStatus(status: ResourceLoadStatus) {
    this._loadStatus = status;
  }

  changeLoadProgress(progress: number) {
    this._loadProgress = progress;
  }

  clear() {
    this.data = null;
    this.changeLoadStatus('ready');
    this.changeLoadProgress(0);
  }
}
