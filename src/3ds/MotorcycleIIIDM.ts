import { PMREMGenerator } from 'three';
import { RoomEnvironment } from 'three/examples/jsm/Addons.js';

import { IIIDM } from '@/IIIDM';
import { IIIDMCore } from '@/IIIDM/IIIDMCore';

export class MotorcycleIIIDM extends IIIDM {
  constructor(core?: IIIDMCore, isDevMode?: boolean) {
    super(core, isDevMode);
  }

  async initialize(): Promise<void> {
    await this.activeResourceManager.loadResource('3ds/7m.glb');

    const pmremGenerator = new PMREMGenerator(this.renderer);

    this.activeScene.environment = pmremGenerator.fromScene(new RoomEnvironment(), 0.04).texture;
    this.activeScene.background = this.activeScene.environment;

    this.activeCamera.position.set(-3, 1, 0);

    const resource = this.activeResourceManager.getResource();

    if (!resource?.data) {
      this.logWorker.error('Resource is not loaded.');
    }

    this.object3DMaps = [
      ...this.object3DMaps,
      { key: 'motocycle', type: 'resource', object: resource.data!.scene },
    ];

    this.activeScene.add(...this.object3DMaps.map(object3DMap => object3DMap.object));

    this.renderer.render(this.activeScene, this.activeCamera);
  }

  update(): void {
    this.activeControlManager.orbitControl?.update();

    this.renderer.render(this.activeScene, this.activeCamera);
  }

  ohhh() {
    this.activeFrameManager.setFrameUpdateAction(() => {
      this.object3DMaps[0].object.rotation.y += 0.01;

      this.update();
    });
  }
}
