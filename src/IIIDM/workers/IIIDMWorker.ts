import { IIIDM } from '@/IIIDM';

export abstract class IIIDMWorker {
  protected maker: IIIDM;

  constructor(maker: IIIDM) {
    this.maker = maker;
  }
}
