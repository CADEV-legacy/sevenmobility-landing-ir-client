export abstract class IIIDM {
  private active: boolean = false;

  constructor() {}

  activate() {
    if (this.active) return;

    this.active = true;
  }

  deactivate() {
    if (!this.active) return;

    this.active = false;
  }

  getStatus() {
    return this.active;
  }

  abstract initialize(): void;
  abstract update(): void;
  abstract resize(): void;
}
