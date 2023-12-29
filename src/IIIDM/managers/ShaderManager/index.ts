import { IIIDM } from '@/IIIDM';
import { IIIDMManager } from '@/IIIDM/managers';

export class ShaderManager extends IIIDMManager {
  constructor(maker: IIIDM) {
    super(maker);
  }

  initialize() {
    this.onInitialize();
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
