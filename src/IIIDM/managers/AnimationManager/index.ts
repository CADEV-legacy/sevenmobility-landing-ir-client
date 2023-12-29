import {
  AnimationClip,
  AnimationMixer,
  AnimationObjectGroup,
  Object3D,
  Object3DEventMap,
} from 'three';

import { IIIDM } from '@/IIIDM';
import { IIIDMManager } from '@/IIIDM/managers';

export class AnimationManager extends IIIDMManager {
  private animationMixer: AnimationMixer | null = null;
  private _animationRootModel: Object3D<Object3DEventMap> | AnimationObjectGroup | null = null;
  private _animationClip: AnimationClip | null = null;

  constructor(maker: IIIDM) {
    super(maker);
  }

  get animationRootModel() {
    if (!this._animationRootModel)
      throw this.logWorker.error(
        'Before get animationRootModel, please initialize AnimationManager.'
      );

    return this._animationRootModel;
  }

  get animationClip() {
    if (!this._animationClip)
      throw this.logWorker.error('Before get animationClip, please initialize AnimationManager.');

    return this._animationClip;
  }

  changeAnimation(
    animationRootModel: Object3D<Object3DEventMap> | AnimationObjectGroup,
    animationClip: AnimationClip
  ) {
    if (!this.animationMixer) throw this.logWorker.error('Not yet fully initialized.');

    this.animationMixer.stopAllAction();
    this.animationMixer.uncacheRoot(animationRootModel);

    this._animationRootModel = animationRootModel;
    this._animationClip = animationClip;
    this.animationMixer = new AnimationMixer(animationRootModel);
  }

  changeAnimationClip(animationClip: AnimationClip) {
    if (!this.animationMixer) throw this.logWorker.error('Not yet fully initialized.');

    this.animationMixer.stopAllAction();
    this.animationMixer.uncacheClip(animationClip);

    this._animationClip = animationClip;
  }

  initialize(
    animationRootModel: Object3D<Object3DEventMap> | AnimationObjectGroup,
    animationClip: AnimationClip
  ) {
    this.onInitialize();

    this._animationRootModel = animationRootModel;
    this._animationClip = animationClip;
    this.animationMixer = new AnimationMixer(animationRootModel);
  }

  activate() {
    this.onActivate();

    if (!this.animationMixer) throw this.logWorker.error('There is no animationMixer.');

    this.animationMixer.clipAction(this.animationClip).play();
  }

  deactivate() {
    this.onDeactivate();

    if (!this.animationMixer) throw this.logWorker.error('There is no animationMixer.');

    this.animationMixer.stopAllAction();
  }

  clear() {
    this.onClear();

    if (!this.animationMixer) return;

    this.animationMixer.stopAllAction();
    this.animationMixer = null;
  }
}
