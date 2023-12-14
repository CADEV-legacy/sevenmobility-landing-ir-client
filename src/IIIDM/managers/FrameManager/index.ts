import { Clock } from 'three';

import { IIIDMCore } from '@/IIIDM/IIIDMCore';
import { IIIDMManager } from '@/IIIDM/IIIDMManager';

export const FRAME_PER_SECOND = {
  '18': 18,
  '24': 24,
  '30': 30,
  '60': 60,
  '90': 90,
  '120': 120,
} as const;

export type FramePerSecond = (typeof FRAME_PER_SECOND)[keyof typeof FRAME_PER_SECOND];

const DEFAULT_FRAME_PER_SECOND = FRAME_PER_SECOND[30];

type FrameInitializeAction = (() => Promise<void>) | undefined;

type FrameUpdateAction = (() => void) | undefined;

/**
 * NOTE: Change every scene in every frame.
 * - Default fps is 30.
 * - frameInitializeAction are optional. and this action will be called asynchronusly.
 * - frameUpdateAction are required. (If you don't need frameInitializeAction, please don't activate this manager.)
 */
export class FrameManager extends IIIDMManager {
  private _fps: FramePerSecond;
  private clock: Clock;
  private delta: number = 0;
  private interval: number;
  private _frameInitializeAction: FrameInitializeAction | null = null;
  private _frameUpdateAction: FrameUpdateAction | null = null;

  constructor(core: IIIDMCore, fps?: FramePerSecond) {
    super(core);

    this._fps = fps ?? DEFAULT_FRAME_PER_SECOND;

    this.clock = new Clock();
    this.interval = 1 / this._fps;
  }

  get fps() {
    return this._fps;
  }

  async activate() {
    this.onActivate();

    if (!this._frameInitializeAction) {
      this.logWorker.info('frameInitializeAction is not set.');
    } else {
      await this._frameInitializeAction();
    }

    this.runFrameUpdateAction();
  }

  deactivate() {
    this.onDeactivate();
  }

  clear(): void {
    this.onClear();

    this._frameInitializeAction = null;
    this._frameUpdateAction = null;
  }

  changeFPS(fps: FramePerSecond) {
    if (this._fps === fps) {
      this.logWorker.warn('Already same fps has set');

      return;
    }

    this._fps = fps;
    this.interval = 1 / this._fps;

    this.logWorker.info(`Change fps to ${fps}`);
  }

  /** NOTE: Initialize frameInitializeAction */
  setFrameInitializeAction(frameInitializeAction: FrameInitializeAction) {
    this._frameInitializeAction = frameInitializeAction;
  }

  /** NOTE: Initialize frameUpdateAction */
  setFrameUpdateAction(frameUpdateAction: FrameUpdateAction) {
    this._frameUpdateAction = frameUpdateAction;
  }

  /** NOTE: When update action is changed, using this function. */
  changeFrameUpdateAction(frameUpdateAction: FrameUpdateAction) {
    this.deactivate();

    this._frameUpdateAction = frameUpdateAction;

    this.activate();
  }

  private runFrameUpdateAction() {
    if (!this._frameUpdateAction) {
      this.logWorker.error('FrameUpdateAction is not set.');

      return;
    }

    requestAnimationFrame(this.runFrameUpdateAction.bind(this));

    this.delta += this.clock.getDelta();

    if (this.delta <= this.interval) return;

    this._frameUpdateAction();

    this.logWorker.info(`[Tick] [Target]:: ${this._frameUpdateAction.name} [FPS]:: ${this._fps}`);

    this.delta = this.delta % this.interval;
  }
}
