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

type CustomRender = () => void;

type TaskedFrameUpdateAction = {
  name: string;
  action: FrameUpdateAction;
};

/**
 * NOTE: Change every scene in every frame.
 * - Default fps is 30.
 */
export class FrameManager extends IIIDMManager {
  private delta: number = 0;
  private interval: number = 1 / DEFAULT_FRAME_PER_SECOND;
  private requestAnimationFrameId: number | null = null;
  private taskedFrameUpdateActions: TaskedFrameUpdateAction[] = [];
  private _customRender: CustomRender | null = null;
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

  get clock() {
    return this._clock;
  }

  set customRender(renderFunction: CustomRender | null) {
    this._customRender = renderFunction;
  }

  /** NOTE: If already same function has added, other functions will be added. */
  addFrameUpdateAction(...actions: TaskedFrameUpdateAction[]) {
    actions.forEach(action => {
      const sameFrameUpdateActionIndex = this.taskedFrameUpdateActions.findIndex(
        taskedFrameUpdateAction => taskedFrameUpdateAction.name === action.name
      );

      if (sameFrameUpdateActionIndex === -1) {
        this.taskedFrameUpdateActions.push(action);

        return;
      }
    });
  }

  /** NOTE: If parameter actions had set on taskedFrameUpdateAction, this function will be remove them. */
  removeFrameUpdateAction(...actionNames: string[]) {
    actionNames.forEach(actionName => {
      const sameFrameUpdateActionIndex = this.taskedFrameUpdateActions.findIndex(
        taskedFrameUpdateAction => taskedFrameUpdateAction.name === actionName
      );

      if (sameFrameUpdateActionIndex !== -1) {
        this.taskedFrameUpdateActions.splice(sameFrameUpdateActionIndex, 1);

        return;
      }
    });
  }

  initialize(fps?: FramePerSecond) {
    this.onInitialize();

    this.taskedFrameUpdateActions = [];
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
    this.taskedFrameUpdateActions = [];
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

    if (!this.taskedFrameUpdateActions.length) {
      this.logWorker.info('There is no tasked frameUpdateAction.');

      this.clearAnimationFrame();

      this.deactivate();

      return;
    }

    this.requestAnimationFrameId = requestAnimationFrame(this.run.bind(this));

    this.delta += this._clock.getDelta();

    if (this.delta <= this.interval) return;

    this.taskedFrameUpdateActions.forEach(taskedFrameUpdateAction =>
      taskedFrameUpdateAction.action()
    );

    if (typeof this._customRender === 'function') {
      this._customRender();
    } else {
      this.maker.render();
    }

    this.logWorker.info(`[Tick] [FPS]:: ${this._fps}`);

    this.delta = this.delta % this.interval;
  }
}
