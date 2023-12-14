import { IIIDMCore } from '@/IIIDM/IIIDMCore';
import { IIIDMManager } from '@/IIIDM/IIIDMManager';

export class AnimationManager extends IIIDMManager {
  constructor(core: IIIDMCore) {
    super(core);
  }

  activate() {
    this.onActivate();
  }

  deactivate() {
    this.onDeactivate();
  }

  clear() {
    this.onClear();
  }
}
