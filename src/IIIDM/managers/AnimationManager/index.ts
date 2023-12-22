import { AnimationMixer, AnimationObjectGroup, Object3D, Object3DEventMap } from 'three';

import { IIIDMCore } from '@/IIIDM/IIIDMCore';
import { IIIDMManager } from '@/IIIDM/IIIDMManager';

export class AnimationManager extends IIIDMManager {
  private _animationMixer: AnimationMixer | null = null;

  constructor(core: IIIDMCore) {
    super(core);
  }

  get animationMixer() {
    if (!this._animationMixer) {
      throw this.logWorker.error('Before get animationMixer, please activate AnimationManager.');
    }

    return this._animationMixer;
  }

  activate(rootModel?: Object3D<Object3DEventMap> | AnimationObjectGroup) {
    this.onActivate();

    if (!this._animationMixer) {
      if (!rootModel) {
        throw this.logWorker.error('On activate, rootModel is not set.');
      }

      this._animationMixer = new AnimationMixer(rootModel);
    }
  }

  deactivate() {
    this.onDeactivate();

    if (!this._animationMixer) {
      this.logWorker.warn('Already deactivated.');

      return;
    }

    this._animationMixer.stopAllAction();
  }

  initialize() {
    this.onInitialize();

    if (!this._animationMixer) {
      this.logWorker.warn('Already initialized.');

      return;
    }

    this._animationMixer = null;
  }

  changeRootModel(rootModel: Object3D<Object3DEventMap> | AnimationObjectGroup) {
    if (this._animationMixer) {
      this._animationMixer.stopAllAction();
    }

    this._animationMixer = new AnimationMixer(rootModel);
  }
}
