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

type FrameUpdateAction = (() => void) | undefined;

type AfterFrameUpdateAction = ((...args: []) => void) | undefined;

/**
 * NOTE: Change every scene in every frame.
 * - Default fps is 30.
 * - frameInitializeAction are optional. and this action will be called asynchronusly.
 * - frameUpdateAction are required. (If you don't need frameInitializeAction, please don't activate this manager.)
 */
export class FrameManager extends IIIDMManager {
  private delta: number = 0;
  private interval: number;
  private requestAnimationFrameId: number | null = null;
  private _clock: Clock;
  private _fps: FramePerSecond;
  private _frameUpdateAction: FrameUpdateAction | null = null;
  private _afterFrameUpdateAction: AfterFrameUpdateAction | null = null;

  constructor(core: IIIDMCore, fps?: FramePerSecond) {
    super(core);

    this._fps = fps ?? DEFAULT_FRAME_PER_SECOND;

    this._clock = new Clock();
    this.interval = 1 / this._fps;
  }

  get fps() {
    return this._fps;
  }

  get clock() {
    return this._clock;
  }

  async activate() {
    this.onActivate();
  }

  deactivate() {
    this.onDeactivate();

    if (this.requestAnimationFrameId) cancelAnimationFrame(this.requestAnimationFrameId);
  }

  initialize(): void {
    this.onInitialize();

    this._fps = DEFAULT_FRAME_PER_SECOND;
    this.delta = 0;
    this.interval = 1 / this._fps;
    this._frameUpdateAction = null;
  }

  set fps(fps: FramePerSecond) {
    if (this._fps === fps) {
      this.logWorker.warn('Already same fps has set');

      return;
    }

    this._fps = fps;
    this.interval = 1 / this._fps;

    this.logWorker.info(`Change fps to ${fps}`);
  }

  set frameUpdateAction(action: FrameUpdateAction) {
    this._frameUpdateAction = action;
  }

  set afterFrameUpdateAction(action: AfterFrameUpdateAction) {
    this._afterFrameUpdateAction = action;
  }

  run() {
    if (!this.isActive) {
      this.logWorker.info('FrameManager is deactivated.');

      if (this._afterFrameUpdateAction) this._afterFrameUpdateAction();

      return;
    }

    if (!this._frameUpdateAction) throw this.logWorker.error('FrameUpdateAction is not set.');

    this.requestAnimationFrameId = requestAnimationFrame(this.run.bind(this));

    this.delta += this._clock.getDelta();

    if (this.delta <= this.interval) return;

    this._frameUpdateAction();

    this.logWorker.info(`[Tick] [Target]:: ${this._frameUpdateAction.name} [FPS]:: ${this._fps}`);

    this.delta = this.delta % this.interval;
  }
}
