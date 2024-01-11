import {
  Color,
  DirectionalLight,
  Layers,
  Mesh,
  MeshStandardMaterial,
  ShaderMaterial,
  Vector2,
  Vector3,
} from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import { GroundMirror, Smoke } from './components';
import { SECTION_DATA, SectionType } from './resources';

import { IIIDM, IIIDMCore } from '@/IIIDM';
import { OnLoadCompleteAction, OnLoadProgressAction } from '@/IIIDM/workers';

type onHideTitleAction = (opacityScore: number) => void;

type SectionCameraInfo = {
  positionAdditionalVector: Vector3;
  lookAtAdditionalVector: Vector3;
};

export class MotorcycleIIIDM extends IIIDM {
  private sectionType: SectionType;
  private motorcycleVelocity = SECTION_DATA.loading.motorcycle.velocity.initialValue;
  private titleOpacityScore = 1;
  private titleOpacityScoreSub = SECTION_DATA.loading.title.opacityScore.sub.initialValue;
  private _onHideTitleAction: onHideTitleAction | null = null;
  private introSectionCameraInfo: SectionCameraInfo = {
    positionAdditionalVector: new Vector3(),
    lookAtAdditionalVector: new Vector3(),
  };
  private batterySectionCameraInfo: SectionCameraInfo = {
    positionAdditionalVector: new Vector3(),
    lookAtAdditionalVector: new Vector3(),
  };
  private bmsSectionCameraInfo: SectionCameraInfo = {
    positionAdditionalVector: new Vector3(),
    lookAtAdditionalVector: new Vector3(),
  };
  private mcuSectionCameraInfo: SectionCameraInfo = {
    positionAdditionalVector: new Vector3(),
    lookAtAdditionalVector: new Vector3(),
  };
  private electricMotorSectionCameraInfo: SectionCameraInfo = {
    positionAdditionalVector: new Vector3(),
    lookAtAdditionalVector: new Vector3(),
  };
  private regenerativeBrakingSectionCameraInfo: SectionCameraInfo = {
    positionAdditionalVector: new Vector3(),
    lookAtAdditionalVector: new Vector3(),
  };
  private userReviewSectionCameraInfo: SectionCameraInfo = {
    positionAdditionalVector: new Vector3(),
    lookAtAdditionalVector: new Vector3(),
  };
  private detailSectionCameraInfo: SectionCameraInfo = {
    positionAdditionalVector: new Vector3(),
    lookAtAdditionalVector: new Vector3(),
  };

  // TODO: Remove this comment.
  private cameraLookAt = new Vector3().copy(SECTION_DATA.loading.camera.lookAt);

  constructor(core: IIIDMCore) {
    super(core);

    this.sectionType = 'loading';

    this.activeScene.background = SECTION_DATA.loading.background.color;

    const smoke = new Smoke(
      SECTION_DATA.loading.objectName.smoke,
      SECTION_DATA.loading.smoke.opacity.initialValue,
      SECTION_DATA.loading.smoke.opacity.additionalValue,
      SECTION_DATA.loading.smoke.rotation.additionalValue
    );

    const groundMirror = new GroundMirror(
      this.canvas.clientWidth,
      this.canvas.clientHeight,
      SECTION_DATA.loading.groundMirror.color,
      SECTION_DATA.loading.groundMirror.name
    );

    this.frameManager.initialize();

    // TODO: Remove this comment.
    this.controlManager.initialize();

    this.activeCamera.position.add(SECTION_DATA.loading.camera.position);
    this.activeCamera.lookAt(this.cameraLookAt);

    this.activeCamera.updateProjectionMatrix();

    this.addObjectsToScene(false, smoke.smokeMesh, groundMirror.mirror);
  }

  // NOTE: Below functions are must set on page before activate.
  set onLoadProgressAction(action: OnLoadProgressAction) {
    this.resourceWorker.onLoadProgressAction = action;
  }

  set onLoadCompleteAction(action: OnLoadCompleteAction) {
    this.resourceWorker.onLoadCompleteAction = action;
  }

  set onHideTitleAction(action: onHideTitleAction) {
    this._onHideTitleAction = action;
  }

  private async loadMotorcycle() {
    try {
      const motorcycle = await this.resourceWorker.loadResource(
        SECTION_DATA.loading.motorcycle.path
      );

      motorcycle.scene.traverse(object => {
        if (
          object instanceof Mesh &&
          object.isMesh &&
          object.name === SECTION_DATA.loading.motorcycle.headLight.key &&
          object.material instanceof MeshStandardMaterial &&
          object.material.isMaterial &&
          object.material.name === `${SECTION_DATA.loading.motorcycle.headLight.key}_material`
        ) {
          object.material.emissive = new Color(0x000000);
          object.material.emissiveIntensity = 0;
        }
      });
      motorcycle.scene.position.add(SECTION_DATA.loading.motorcycle.position);
      motorcycle.scene.name = SECTION_DATA.loading.objectName.motorcycle;

      this.addObjectsToScene(true, motorcycle.scene);
    } catch (error) {
      throw this.logWorker.error('Failed to load model.', error);
    }
  }

  private async hideTitle() {
    return new Promise<void>((resolve, reject) => {
      const onHideTitle = () => {
        if (!this._onHideTitleAction)
          return reject(this.logWorker.error('onHideTitleAction is not set.'));

        if (this.titleOpacityScore <= 0) {
          this.frameManager.removeFrameUpdateAction(onHideTitle.name);
          return resolve();
        }

        this.titleOpacityScoreSub += SECTION_DATA.loading.title.opacityScore.sub.additionalValue;

        this._onHideTitleAction((this.titleOpacityScore -= this.titleOpacityScoreSub));
      };

      this.frameManager.addFrameUpdateAction({
        name: onHideTitle.name,
        action: onHideTitle.bind(this),
      });
      this.frameManager.activate();
    });
  }

  private showMotorcycle() {
    this.activeScene.traverse(object => {
      if (
        object instanceof Mesh &&
        object.isMesh &&
        object.name === SECTION_DATA.loading.motorcycle.headLight.key &&
        object.material instanceof MeshStandardMaterial &&
        object.material.isMaterial &&
        object.material.name === `${SECTION_DATA.loading.motorcycle.headLight.key}_material`
      ) {
        object.material.emissive = SECTION_DATA.loading.motorcycle.headLight.emissiveColor;
        object.material.emissiveIntensity =
          SECTION_DATA.loading.motorcycle.headLight.emissiveIntensity;
      }
    });

    const directionalLight = new DirectionalLight(
      SECTION_DATA.loading.directionalLight.color,
      SECTION_DATA.loading.directionalLight.intensity
    );

    directionalLight.position.add(SECTION_DATA.loading.directionalLight.position);
    directionalLight.target.position.add(SECTION_DATA.loading.directionalLight.targetPosition);
    directionalLight.name = SECTION_DATA.loading.objectName.directionalLight;

    this.addObjectsToScene(true, directionalLight);
  }

  private closerMotorcycle() {
    return new Promise<void>(resolve => {
      const runMotorcycle = () => {
        this.activeScene.traverse(object => {
          // NOTE: Change motorcycle position by velocity.
          if (object.name === SECTION_DATA.loading.objectName.motorcycle) {
            object.position.add(new Vector3(-this.motorcycleVelocity, 0, 0));
          }

          // NOTE: Change directional light intensity.
          if (
            object instanceof DirectionalLight &&
            object.name === SECTION_DATA.loading.objectName.directionalLight
          ) {
            if (object.intensity <= SECTION_DATA.loading.directionalLight.maxIntensity)
              object.intensity += 0.1;
          }
        });

        // NOTE: Change motorcycle velocity.
        if (this.motorcycleVelocity >= 0) {
          this.motorcycleVelocity -= SECTION_DATA.loading.motorcycle.velocity.acceleration;
        } else {
          this.frameManager.removeFrameUpdateAction(runMotorcycle.name);
          return resolve();
        }
      };

      this.frameManager.addFrameUpdateAction({
        name: runMotorcycle.name,
        action: runMotorcycle.bind(this),
      });
    });
  }

  private startTheEngine() {
    const bloomLayer = new Layers();

    bloomLayer.set(SECTION_DATA.loading.bloomEffect.layerDepth);

    this.activeScene.traverse(object => {
      if (
        object instanceof Mesh &&
        object.isMesh &&
        object.name === SECTION_DATA.loading.motorcycle.headLight.key &&
        object.material instanceof MeshStandardMaterial &&
        object.material.isMaterial &&
        object.material.name === `${SECTION_DATA.loading.motorcycle.headLight.key}_material`
      ) {
        object.material.color = SECTION_DATA.loading.motorcycle.headLight.emissiveColor;
        object.material.emissiveIntensity =
          SECTION_DATA.loading.motorcycle.headLight.changedEmissiveIntensity;
        object.layers.enable(SECTION_DATA.loading.bloomEffect.layerDepth);
      }
    });

    const bloomEffectComposer = new EffectComposer(this.renderer);

    const renderScene = new RenderPass(this.activeScene, this.activeCamera);
    const bloomPass = new UnrealBloomPass(
      new Vector2(this.canvas.width, this.canvas.height),
      SECTION_DATA.loading.bloomEffect.strength,
      SECTION_DATA.loading.bloomEffect.radius,
      SECTION_DATA.loading.bloomEffect.threshold
    );

    bloomEffectComposer.setPixelRatio(window.devicePixelRatio);
    bloomEffectComposer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);
    bloomEffectComposer.addPass(renderScene);
    bloomEffectComposer.addPass(bloomPass);
    bloomEffectComposer.renderToScreen = false;

    const finalEffectComposer = new EffectComposer(this.renderer);
    finalEffectComposer.setPixelRatio(window.devicePixelRatio);
    finalEffectComposer.setSize(this.canvas.clientWidth, this.canvas.clientHeight);

    const mixPass = new ShaderPass(
      new ShaderMaterial({
        uniforms: {
          baseTexture: { value: null },
          bloomTexture: { value: bloomEffectComposer.renderTarget2.texture },
        },
        vertexShader: SECTION_DATA.loading.bloomEffect.vertex,
        fragmentShader: SECTION_DATA.loading.bloomEffect.fragment,
        defines: {},
      }),
      'baseTexture'
    );
    mixPass.needsSwap = true;

    const outputPass = new OutputPass();

    finalEffectComposer.addPass(renderScene);
    finalEffectComposer.addPass(mixPass);
    finalEffectComposer.addPass(outputPass);

    this.renderer.autoClear = false;
    this.renderer.clear();

    this.activeCamera.layers.set(SECTION_DATA.loading.bloomEffect.layerDepth);

    bloomEffectComposer.render();

    this.renderer.clearDepth();

    this.activeCamera.layers.set(0);

    finalEffectComposer.render();

    this.renderer.autoClear = true;
  }

  private getAdditionalVector(originalVector: Vector3, targetVector: Vector3, changeCount: number) {
    return new Vector3(
      (targetVector.x - originalVector.x) / changeCount,
      (targetVector.y - originalVector.y) / changeCount,
      (targetVector.z - originalVector.z) / changeCount
    );
  }

  // NOTE: Intro Section
  private changePOVToIntroSection() {
    let cameraPositionChangeCount = SECTION_DATA.intro.camera.changeCount;

    const cameraPositionAdditionalVector = this.getAdditionalVector(
      this.activeCamera.position,
      SECTION_DATA.intro.camera.position,
      SECTION_DATA.intro.camera.changeCount
    );
    const cameraLookAtAdditionalVector = this.getAdditionalVector(
      this.cameraLookAt,
      SECTION_DATA.intro.camera.lookAt,
      SECTION_DATA.intro.camera.changeCount
    );

    const moveCameraOnIntroSection = () => {
      if (cameraPositionChangeCount-- <= 0) {
        this.frameManager.removeFrameUpdateAction(moveCameraOnIntroSection.name);
        this.sectionType = 'intro';

        const introSectionCameraPositionAdditionalVector = this.getAdditionalVector(
          this.activeCamera.position,
          SECTION_DATA.battery.camera.position,
          SECTION_DATA.battery.camera.changeCount
        );
        const introSectionCameraLookAtAdditionalVector = this.getAdditionalVector(
          this.cameraLookAt,
          SECTION_DATA.battery.camera.lookAt,
          SECTION_DATA.battery.camera.changeCount
        );

        this.introSectionCameraInfo.positionAdditionalVector =
          introSectionCameraPositionAdditionalVector;
        this.introSectionCameraInfo.lookAtAdditionalVector =
          introSectionCameraLookAtAdditionalVector;

        return;
      }

      this.activeCamera.position.add(cameraPositionAdditionalVector);

      this.cameraLookAt.add(cameraLookAtAdditionalVector);

      this.activeCamera.lookAt(this.cameraLookAt);

      this.activeCamera.updateProjectionMatrix();
    };

    this.frameManager.addFrameUpdateAction({
      name: moveCameraOnIntroSection.name,
      action: moveCameraOnIntroSection.bind(this),
    });
    this.frameManager.activate();
  }

  private changePOVOnIntroSection(wheelEvent: WheelEvent) {
    console.info(this.activeCamera.position);
    if (wheelEvent.deltaY > 0) {
      if (this.activeCamera.position.x >= SECTION_DATA.battery.camera.position.x) {
        this.sectionType = 'battery';

        return;
      }

      this.activeCamera.position.add(this.introSectionCameraInfo.positionAdditionalVector);

      this.cameraLookAt.add(this.introSectionCameraInfo.lookAtAdditionalVector);

      this.activeCamera.lookAt(this.cameraLookAt);
    } else {
      if (this.activeCamera.position.x <= SECTION_DATA.intro.camera.position.x) {
        this.logWorker.warn('Intro section is the first section.');

        return;
      }

      this.activeCamera.position.sub(this.introSectionCameraInfo.positionAdditionalVector);

      this.cameraLookAt.sub(this.introSectionCameraInfo.lookAtAdditionalVector);

      this.activeCamera.lookAt(this.cameraLookAt);
    }

    this.activeCamera.updateProjectionMatrix();
    this.render();
  }

  // NOTE: Battery Section
  private changePOVOnBatterySection(wheelEvent: WheelEvent) {
    this.sectionType = 'battery';

    this.activeScene.background = SECTION_DATA.battery.background.color;

    this.activeCamera.position.set(
      SECTION_DATA.battery.camera.position.x,
      SECTION_DATA.battery.camera.position.y,
      SECTION_DATA.battery.camera.position.z
    );
    this.activeCamera.lookAt(SECTION_DATA.battery.camera.lookAt);

    this.activeCamera.updateProjectionMatrix();

    this.render();
  }

  // NOTE: MCU Section

  // NOTE: Electric Motor Section
  private changePOVOnElectricMotorSection(wheelEvent: WheelEvent) {
    this.sectionType = 'electricMotor';

    // TODO: Remove this comment.
    this.activeScene.background = SECTION_DATA.battery.background.color;

    this.activeCamera.position.set(
      SECTION_DATA.electricMotor.camera.position.x,
      SECTION_DATA.electricMotor.camera.position.y,
      SECTION_DATA.electricMotor.camera.position.z
    );
    this.activeCamera.lookAt(SECTION_DATA.electricMotor.camera.lookAt);

    this.activeCamera.updateProjectionMatrix();

    this.render();
  }

  // NOTE: User Review Section
  private changePOVOnUserReviewSection(wheelEvent: WheelEvent) {
    this.sectionType = 'userReview';

    // TODO: Remove this comment.
    this.activeScene.background = SECTION_DATA.battery.background.color;

    this.activeCamera.position.set(
      SECTION_DATA.userReview.camera.position.x,
      SECTION_DATA.userReview.camera.position.y,
      SECTION_DATA.userReview.camera.position.z
    );
    this.activeCamera.lookAt(SECTION_DATA.userReview.camera.lookAt);

    this.activeCamera.updateProjectionMatrix();

    this.render();
  }

  resize() {
    this.onResize();

    this.render();
  }

  render() {
    this.onRender();
  }

  scroll(wheelEvent: WheelEvent) {
    switch (this.sectionType) {
      case 'loading':
        this.logWorker.warn('Scroll event is not available in loading section.');
        return;
      case 'intro':
        this.changePOVOnIntroSection(wheelEvent);
        break;
      case 'battery':
        this.changePOVOnBatterySection(wheelEvent);
        break;
      case 'bms':
        break;
      case 'mcu':
        break;
      case 'electricMotor':
        this.changePOVOnElectricMotorSection(wheelEvent);
        break;
      case 'regenerativeBraking':
        break;
      case 'userReview':
        this.changePOVOnUserReviewSection(wheelEvent);
        break;
      case 'detail':
        break;
      default:
        this.logWorker.warn('Scroll event is not available in loading section.');
        break;
    }
  }

  /**
   * NOTE: For manage POV.
   * TODO: Remove this after set POV.
   */
  private updateControl() {
    this.controlManager.orbitControl.target = this.cameraLookAt;
    this.controlManager.orbitControl.update();
    this.activeCamera.lookAt(this.cameraLookAt);

    this.activeCamera.updateProjectionMatrix();
  }
  /**
   * NOTE: For manage POV.
   * TODO: Remove this after set POV.
   */
  private setPOVHelper() {
    const povPositionFolder = this.GUIManager.gui.addFolder('POV position');

    povPositionFolder.add(this.activeCamera.position, 'x', -10, 10, 0.01);
    povPositionFolder.add(this.activeCamera.position, 'y', -10, 10, 0.01);
    povPositionFolder.add(this.activeCamera.position, 'z', -10, 10, 0.01);

    const povLookAtFolder = this.GUIManager.gui.addFolder('POV lookAt');

    povLookAtFolder.add(this.cameraLookAt, 'x', -10, 10, 0.01);
    povLookAtFolder.add(this.cameraLookAt, 'y', -10, 10, 0.01);
    povLookAtFolder.add(this.cameraLookAt, 'z', -10, 10, 0.01);

    this.GUIManager.gui.open();

    this.controlManager.orbitControl.target = this.cameraLookAt;
    this.controlManager.orbitControl.update();
    this.controlManager.activate();

    this.frameManager.addFrameUpdateAction({
      name: this.updateControl.name,
      action: this.updateControl.bind(this),
    });
    this.frameManager.activate();
  }

  async activate() {
    this.onActivate();

    await this.loadMotorcycle();

    // NOTE: Loading Section
    await this.hideTitle();

    this.showMotorcycle();

    await this.closerMotorcycle();

    this.startTheEngine();

    setTimeout(() => {
      this.changePOVToIntroSection();
    }, 800);
  }

  deactivate() {
    this.onDeactivate();
  }

  dispose() {
    this.onDispose();
  }
}
