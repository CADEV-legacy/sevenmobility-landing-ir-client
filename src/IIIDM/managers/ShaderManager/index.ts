import { IIIDMCore } from '@/IIIDM/IIIDMCore';
import { IIIDMManager } from '@/IIIDM/IIIDMManager';

export class ShaderManager extends IIIDMManager {
  constructor(core: IIIDMCore) {
    super(core);
  }

  activate() {
    this.onActivate();
  }

  deactivate() {
    this.onDeactivate();
  }

  initialize() {
    this.onInitialize();
  }
}
