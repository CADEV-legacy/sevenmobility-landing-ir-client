import { Clock } from 'three';

import { IIIDM } from '@/IIIDM';
import { IIIDMManager } from '@/IIIDM/managers/IIIDMManager';

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

type FrameUpdateAction = () => void;

type RenderFunction = () => void;

/**
 * NOTE: Change every scene in every frame.
 * - Default fps is 30.
 */
export class FrameManager extends IIIDMManager {
  private delta: number = 0;
  private interval: number = 1 / DEFAULT_FRAME_PER_SECOND;
  private requestAnimationFrameId: number | null = null;
  private taskedFrameUpdateAction: FrameUpdateAction[] = [];
  private _renderFunction: RenderFunction | null = null;
  private _clock: Clock = new Clock();
  private _fps: FramePerSecond = DEFAULT_FRAME_PER_SECOND;

  constructor(maker: IIIDM) {
    super(maker);
  }

  get fps() {
    return this._fps;
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

  get renderFunction() {
    if (!this._renderFunction)
      throw this.logWorker.error('Before get renderFunction, please initialize FrameManager.');

    return this._renderFunction;
  }

  set renderFunction(renderFunction: RenderFunction) {
    this._renderFunction = renderFunction;
  }

  get clock() {
    return this._clock;
  }

  /** NOTE: If already same function has added, other functions will be added. */
  addFrameUpdateAction(...actions: FrameUpdateAction[]) {
    actions.forEach(action => {
      const sameFrameUpdateActionIndex = this.taskedFrameUpdateAction.findIndex(
        taskedFrameUpdateAction => taskedFrameUpdateAction === action
      );

      if (sameFrameUpdateActionIndex === -1) {
        this.taskedFrameUpdateAction.push(action);

        return;
      }
    });
  }

  /** NOTE: If parameter actions had set on taskedFrameUpdateAction, this function will be remove them. */
  removeFrameUpdateAction(...actions: FrameUpdateAction[]) {
    actions.forEach(action => {
      const sameFrameUpdateActionIndex = this.taskedFrameUpdateAction.findIndex(
        taskedFrameUpdateAction => taskedFrameUpdateAction === action
      );

      if (sameFrameUpdateActionIndex !== -1) {
        this.taskedFrameUpdateAction.splice(sameFrameUpdateActionIndex, 1);

        return;
      }
    });
  }

  initialize(renderFunction: RenderFunction, fps?: FramePerSecond) {
    this.onInitialize();

    this.renderFunction = renderFunction;
    this._fps = fps ?? DEFAULT_FRAME_PER_SECOND;
    this.interval = 1 / this._fps;
  }

  activate() {
    this.onActivate();

    this.run();
  }

  deactivate() {
    this.onDeactivate();
  }

  clear() {
    this.onClear();

    this._fps = DEFAULT_FRAME_PER_SECOND;
    this.delta = 0;
    this.interval = 1 / this._fps;
    this.taskedFrameUpdateAction = [];
  }

  private clearAnimationFrame() {
    if (!this.requestAnimationFrameId) return;

    cancelAnimationFrame(this.requestAnimationFrameId);
    this.requestAnimationFrameId = null;
  }

  private run() {
    if (!this.isInitialized) throw this.logWorker.error('FrameManager is not initialized.');

    if (!this.isActive) {
      this.logWorker.info('FrameManager is not activated.');

      this.clearAnimationFrame();

      return;
    }

    if (!this.taskedFrameUpdateAction.length) {
      this.logWorker.info('There is no tasked frameUpdateAction.');

      this.clearAnimationFrame();

      return;
    }

    this.requestAnimationFrameId = requestAnimationFrame(this.run.bind(this));

    this.delta += this._clock.getDelta();

    if (this.delta <= this.interval) return;

    this.taskedFrameUpdateAction.forEach(frameUpdateAction => frameUpdateAction());

    this.renderFunction!();

    this.logWorker.info(`[Tick] [FPS]:: ${this._fps}`);

    this.delta = this.delta % this.interval;
  }
}
