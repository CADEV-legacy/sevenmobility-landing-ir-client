import {
  Color,
  DirectionalLight,
  Material,
  Mesh,
  MeshStandardMaterial,
  PMREMGenerator,
  Vector3,
} from 'three';

import { SmokeGenerator } from './SmokeGenerator';

import { IIIDM } from '@/IIIDM';
import { IIIDMCore } from '@/IIIDM/IIIDMCore';
import { OnLoadCompleteAction, OnLoadProgressAction } from '@/IIIDM/managers';

const BLOOM_LAYER_DEPTH = 2 as const;

const OBJECT_3D_MAP_KEY = {
  motorcycleResource: 'motorcycleResource',
  initialDirectionalLight: 'loadedDirectionalLight',
  smokeMesh: 'smokeMesh',
} as const;

type SectionType =
  | 'initial'
  | 'battery'
  | 'bms'
  | 'mcu'
  | 'electricMotor'
  | 'electricMotorRegenerativeBreaking'
  | 'review';

const SECTION_DATA = {
  initial: {
    step: {
      loadMotorcycle: {
        position: new Vector3(-2, 0.4, 0),
        lookAt: new Vector3(0, 0.4, 0),
        velocity: 0.01,
        acceleration: 0.001,
      },
      closerCamera: {
        position: new Vector3(-1.2, 0.3, 0),
        lookAt: new Vector3(0, 0.4, 0),
        velocity: 0.1,
      },
      startTheEngine: {
        blinkCount: 4,
        bloomPass: {
          strength: 2,
          radius: 1,
          threshold: 0,
        },
      },
      turnOnTheLight: {},
    },
    directionalLight: {
      color: new Color(0xffffff),
      intensity: 0.8,
      position: new Vector3(-2, 1, 0),
      targetPosition: new Vector3(0, 0, 0),
    },
    motorcycleHeadLight: {
      key: {
        leftHeadLight: 'Sphere002',
        rightHeadLight: 'Sphere003',
      },
      emissiveColor: new Color(0xffffff),
      emissiveIntensity: {
        loaded: 0.2,
        closer: 5,
      },
    },
  },
} as const;

export class MotorcycleIIIDM extends IIIDM {
  private section: SectionType;
  private smokeMesh: Mesh;
  private velocity = 0.02;
  private acceleration = 0.0003;

  constructor(core: IIIDMCore) {
    super(core);

    this.section = 'initial';
    this.smokeMesh = new SmokeGenerator().smokeMeshe;
  }

  // Below functions are using on page.
  set onLoadProgressAction(action: OnLoadProgressAction) {
    this.activeResourceManager.onLoadProgressAction = action;
  }

  set onLoadCompleteAction(action: OnLoadCompleteAction) {
    this.activeResourceManager.onLoadCompleteAction = action;
  }

  private changeHeadLightIntensity(intensity: number) {
    this.activeResourceManager.resource.data.scene.traverse(object => {
      if (
        object instanceof Mesh &&
        object.isMesh &&
        object.material instanceof MeshStandardMaterial &&
        object.material.isMaterial
      ) {
        if (
          object.name === SECTION_DATA.initial.motorcycleHeadLight.key.leftHeadLight ||
          object.name === SECTION_DATA.initial.motorcycleHeadLight.key.rightHeadLight
        ) {
          object.material.emissive = SECTION_DATA.initial.motorcycleHeadLight.emissiveColor;
          object.material.emissiveIntensity = intensity;
        }
      }
    });
  }

  private async loadMotorcycle() {
    try {
      this.activeResourceManager.activate();

      await this.activeResourceManager.loadResource('/3ds/models/7m2.glb');

      this.changeHeadLightIntensity(0);

      const initialDirectionalLight = new DirectionalLight(
        SECTION_DATA.initial.directionalLight.color,
        SECTION_DATA.initial.directionalLight.intensity
      );

      initialDirectionalLight.position.add(SECTION_DATA.initial.directionalLight.position);
      initialDirectionalLight.target.position.add(
        SECTION_DATA.initial.directionalLight.targetPosition
      );

      this.changeObject3DMap([
        {
          key: OBJECT_3D_MAP_KEY.motorcycleResource,
          type: 'resource',
          object: this.activeResourceManager.resource.data.scene,
        },
        {
          key: OBJECT_3D_MAP_KEY.initialDirectionalLight,
          type: 'light',
          object: initialDirectionalLight,
        },
        {
          key: OBJECT_3D_MAP_KEY.smokeMesh,
          type: 'mesh',
          object: this.smokeMesh,
        },
      ]);

      this.activeCamera.position.add(SECTION_DATA.initial.step.loadMotorcycle.position);
      this.activeCamera.lookAt(SECTION_DATA.initial.step.loadMotorcycle.lookAt);
      this.activeCamera.updateProjectionMatrix();

      this.render();
    } catch (error) {
      throw this.logWorker.error('Failed to load model.', error);
    }
  }

  private closerCamera() {
    if (this.velocity <= 0) {
      this.activeFrameManager.deactivate();

      setTimeout(() => {
        this.startTheEngine();
      }, 500);

      return;
    }

    if (this.smokeMesh.material instanceof Material && this.smokeMesh.material.opacity < 1)
      this.smokeMesh.material.opacity += 0.01;
    this.smokeMesh.rotation.x += 0.005;

    this.activeCamera.position.add(new Vector3(this.velocity, 0, 0));
    this.velocity -= this.acceleration;
    this.activeCamera.updateProjectionMatrix();

    this.render();
  }

  private startTheEngine() {
    this.changeHeadLightIntensity(0.5);

    this.activeEffectManager.activate(0.8, 0.2, 0.4, 'selective', BLOOM_LAYER_DEPTH);
    this.activeResourceManager.resource.data.scene.traverse(object => {
      if (
        object instanceof Mesh &&
        object.isMesh &&
        object.material instanceof MeshStandardMaterial &&
        object.material.isMaterial
      ) {
        if (
          object.name === SECTION_DATA.initial.motorcycleHeadLight.key.leftHeadLight ||
          object.name === SECTION_DATA.initial.motorcycleHeadLight.key.rightHeadLight
        ) {
          object.layers.enable(BLOOM_LAYER_DEPTH);
        }
      }
    });

    this.render();
  }

  private turnOnLight() {
    const pmremGenerator = new PMREMGenerator(this.renderer);

    pmremGenerator.fromScene(this.activeScene, 0.3);
  }

  resize(): void {
    this.onResize();

    if (this.activeEffectManager.isActive) {
      this.activeEffectManager.resize();
    }
  }

  render() {
    this.onRender();

    if (this.activeEffectManager.isActive) {
      this.activeEffectManager.render();
    }
  }

  async activate() {
    this.onActivate();

    this.activeFrameManager.activate();

    // TODO: Remove this on task has finished.
    this.activeControlManager.activate();

    await this.loadMotorcycle();

    this.activeFrameManager.frameUpdateAction = this.closerCamera.bind(this);
    // this.activeFrameManager.afterFrameUpdateAction = this.startTheEngine.bind(this);

    this.activeFrameManager.run();
  }

  deactivate() {
    this.onDeactivate();
  }

  dispose() {
    this.onDispose();
  }
}
