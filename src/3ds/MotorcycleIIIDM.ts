import {
  Color,
  DirectionalLight,
  Mesh,
  MeshStandardMaterial,
  PMREMGenerator,
  PlaneGeometry,
  Vector3,
} from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import { GLTF } from 'three-stdlib';

import { IIIDM } from '@/IIIDM';
import { IIIDMCore } from '@/IIIDM/IIIDMCore';
import { SmokeEffect } from '@/IIIDM/managers';
import { OnLoadCompleteAction, OnLoadProgressAction } from '@/IIIDM/workers';

const BLOOM_LAYER_DEPTH = 2 as const;

const OBJECT_3D_NAME = {
  motorcycleModel: 'motorcycleModel',
  loadingSectionDirectionalLight: 'loadingSectionDirectionalLight',
  smokeMesh: 'smokeMesh',
} as const;

type SectionType =
  | 'loading'
  | 'battery'
  | 'bms'
  | 'mcu'
  | 'electricMotor'
  | 'electricMotorRegenerativeBreaking'
  | 'review';

const LOADING_SECTION_DATA = {
  loadMotorcycle: {
    perspectiveCamera: {
      position: new Vector3(-10, 1.5, 0),
      lookAt: new Vector3(0, 1, 0),
    },
    directionalLight: {
      color: new Color(0xffffff),
      intensity: 0.1,
      position: new Vector3(-10, 1, 0),
      targetPosition: new Vector3(0, 0, 0),
    },
    motorcycle: {
      headLight: {
        key: 'light',
        emissiveColor: new Color(0xffffff),
        emissiveIntensity: 0.05,
      },
    },
  },
  closerCamera: {
    smoke: {
      opacity: {
        add: 0.04,
      },
      rotation: {
        add: 0.008,
      },
    },
    motorcycle: {
      initialVelocity: 0.12,
      acceleration: 0.0014,
    },
  },
  startTheEngine: {
    motorcycle: {
      headLight: {
        key: 'light',
        emissiveIntensity: 1,
        bloomPass: {
          strength: 1.5,
          radius: 0.5,
          threshold: 0,
        },
      },
    },
    moveCameraToSide: {},
  },
  turnOnTheLight: {},
} as const;

type OnLoadingSectionStart = (opacityScore: number) => void;

// const BATTERY_SECTINO_DATA = {} as const;

// const BMS_SECTION_DATA = {} as const;

// const MCU_SECTION_DATA = {} as const;

// const ELECTRIC_MOTOR_SECTION_DATA = {} as const;

// const ELECTRIC_MOTOR_REGENERATIVE_BREAKING_SECTION_DATA = {} as const;

// const REVIEW_SECTION_DATA = {} as const;

export class MotorcycleIIIDM extends IIIDM {
  private motorcycleModel: GLTF | null = null;
  private section: SectionType;
  private smokeEffect: SmokeEffect;
  private motorcycleVelocity: number;
  private loadingCameraRotationCircleRadius: number | null = null;
  private loadingCameraRotationCicleYPosition: number | null = null;
  private loadingSectionStartAction: OnLoadingSectionStart | null = null;
  private loadingSectionTitleOpacityScore: number = 1;

  constructor(core: IIIDMCore) {
    super(core);

    this.section = 'loading';
    this.smokeEffect = new SmokeEffect();
    this.motorcycleVelocity = LOADING_SECTION_DATA.closerCamera.motorcycle.initialVelocity;
    this.openGroundMirror();
    console.info(this);

    this.activeFrameManager.initialize(this.render.bind(this), 30);
    this.activeEffectManager.initialize(
      LOADING_SECTION_DATA.startTheEngine.motorcycle.headLight.bloomPass.strength,
      LOADING_SECTION_DATA.startTheEngine.motorcycle.headLight.bloomPass.radius,
      LOADING_SECTION_DATA.startTheEngine.motorcycle.headLight.bloomPass.threshold,
      'selective',
      BLOOM_LAYER_DEPTH
    );
    this.activeControlManager.initialize();
  }

  // Below functions are using on page.
  set onLoadProgressAction(action: OnLoadProgressAction) {
    this.resourceWorker.onLoadProgressAction = action;
  }

  set onLoadCompleteAction(action: OnLoadCompleteAction) {
    this.resourceWorker.onLoadCompleteAction = action;
  }

  set onLoadingSectionStart(action: OnLoadingSectionStart) {
    this.loadingSectionStartAction = action;
  }

  private openGroundMirror() {
    const groundGeometry = new PlaneGeometry(1000, 1000);
    const groundMirror = new Reflector(groundGeometry, {
      clipBias: 0.003,
      textureWidth: this.canvas.width * window.devicePixelRatio,
      textureHeight: this.canvas.height * window.devicePixelRatio,
      color: 0x363636,
    });
    groundMirror.position.set(0, 0, 0);
    groundMirror.rotateX(-Math.PI / 2);
    groundMirror.name = 'groundMirror';

    // TODO: 내일 진행할 것.
    // this.addObjectsToScene(true, groundMirror);
  }

  private changeHeadLightIntensity(intensity: number) {
    this.motorcycleModel?.scene.traverse(object => {
      if (
        object instanceof Mesh &&
        object.isMesh &&
        object.name === LOADING_SECTION_DATA.loadMotorcycle.motorcycle.headLight.key &&
        object.material instanceof MeshStandardMaterial &&
        object.material.isMaterial &&
        object.material.name ===
          `${LOADING_SECTION_DATA.loadMotorcycle.motorcycle.headLight.key}_material`
      ) {
        object.material.emissive =
          LOADING_SECTION_DATA.loadMotorcycle.motorcycle.headLight.emissiveColor;
        object.material.emissiveIntensity = intensity;
      }
    });
  }

  private async loadMotorcycle() {
    try {
      this.motorcycleModel = await this.resourceWorker.loadResource('/3ds/models/motorcycle.glb');

      this.motorcycleModel.scene.name = OBJECT_3D_NAME.motorcycleModel;

      const loadingDirectionalLight = new DirectionalLight(
        LOADING_SECTION_DATA.loadMotorcycle.directionalLight.color,
        LOADING_SECTION_DATA.loadMotorcycle.directionalLight.intensity
      );

      loadingDirectionalLight.position.add(
        LOADING_SECTION_DATA.loadMotorcycle.directionalLight.position
      );
      loadingDirectionalLight.target.position.add(
        LOADING_SECTION_DATA.loadMotorcycle.directionalLight.targetPosition
      );
      loadingDirectionalLight.name = OBJECT_3D_NAME.loadingSectionDirectionalLight;

      this.addObjectsToScene(
        true,
        this.motorcycleModel.scene,
        loadingDirectionalLight,
        this.smokeEffect.smokeMesh
      );

      this.changeHeadLightIntensity(
        LOADING_SECTION_DATA.loadMotorcycle.motorcycle.headLight.emissiveIntensity
      );

      this.activeCamera.position.add(
        LOADING_SECTION_DATA.loadMotorcycle.perspectiveCamera.position
      );
      this.activeCamera.lookAt(LOADING_SECTION_DATA.loadMotorcycle.perspectiveCamera.lookAt);
      this.activeCamera.updateProjectionMatrix();

      this.render();
    } catch (error) {
      throw this.logWorker.error('Failed to load model.', error);
    }
  }

  private closerCamera() {
    if (this.motorcycleVelocity >= 0) {
      this.activeCamera.position.add(new Vector3(this.motorcycleVelocity, 0, 0));
      this.motorcycleVelocity -= LOADING_SECTION_DATA.closerCamera.motorcycle.acceleration;
      this.activeCamera.updateProjectionMatrix();
    } else {
      this.startTheEngine();
      this.activeFrameManager.removeFrameUpdateAction('closerCamera');
    }
  }

  private openSmokeEffect() {
    this.smokeEffect.frameAction();
  }

  private titleHandleFrameAction() {
    if (this.loadingSectionTitleOpacityScore <= 0.2) {
      this.activeFrameManager.changeFrameUpdateAction([
        { key: 'closerCamera', action: this.closerCamera.bind(this) },
        { key: 'openSmokeEffect', action: this.openSmokeEffect.bind(this) },
      ]);

      const dirLight = this.activeScene.getObjectByName(
        OBJECT_3D_NAME.loadingSectionDirectionalLight
      ) as DirectionalLight;

      if (dirLight.intensity <= 2) {
        dirLight.intensity += 0.1;
      }
    }

    if (this.loadingSectionTitleOpacityScore <= 0) {
      this.activeFrameManager.removeFrameUpdateAction('titleHandleFrameAction');
    }

    this.loadingSectionStartAction?.((this.loadingSectionTitleOpacityScore -= 0.018));
  }

  private startTheEngine() {
    setTimeout(() => {
      this.changeHeadLightIntensity(
        LOADING_SECTION_DATA.startTheEngine.motorcycle.headLight.emissiveIntensity
      );

      this.motorcycleModel?.scene.traverse(object => {
        if (
          object instanceof Mesh &&
          object.isMesh &&
          object.name === LOADING_SECTION_DATA.loadMotorcycle.motorcycle.headLight.key &&
          object.material instanceof MeshStandardMaterial &&
          object.material.isMaterial
        ) {
          console.info('Layer on');
          console.info(object);
          object.layers.enable(BLOOM_LAYER_DEPTH);
        }
      });

      this.render();

      // this.removeObject3DMap(OBJECT_3D_MAP_KEY.smokeMesh);
      // this.activeFrameManager.removeFrameUpdateAction('openSmokeEffect');
      // this.activeFrameManager.changeFrameUpdateAction({
      //   key: 'moveCameraToSide',
      //   action: this.moveCameraToSide.bind(this),
      // });
      const premGenerator = new PMREMGenerator(this.renderer);
      premGenerator.fromScene(this.activeScene, 0.04);
    }, 500);
  }

  private moveCameraToSide() {
    if (!this.loadingCameraRotationCircleRadius || !this.loadingCameraRotationCicleYPosition) {
      this.loadingCameraRotationCircleRadius = Math.sqrt(
        Math.pow(this.activeCamera.position.x, 2) + Math.pow(this.activeCamera.position.z, 2)
      );
      this.loadingCameraRotationCicleYPosition = this.activeCamera.position.y;
    }

    const newZPosition = (this.activeCamera.position.z += 0.01);
    const newXPosition = Math.sqrt(
      Math.pow(this.loadingCameraRotationCircleRadius, 2) - Math.pow(newZPosition, 2)
    );

    this.activeCamera.position.set(
      -newXPosition,
      this.loadingCameraRotationCicleYPosition,
      newZPosition
    );
    this.activeCamera.updateProjectionMatrix();
  }

  resize() {
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

    await this.loadMotorcycle();

    this.activeControlManager.activate();
    this.activeFrameManager.addFrameUpdateAction(this.titleHandleFrameAction.bind(this));

    setTimeout(() => {
      this.activeFrameManager.activate();
    }, 500);
  }

  deactivate() {
    this.onDeactivate();
  }

  dispose() {
    this.onDispose();
  }
}
