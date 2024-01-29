import {
  AmbientLight,
  Color,
  DirectionalLight,
  Group,
  Layers,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Object3D,
  Object3DEventMap,
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
import { SECTION_DATA } from './resources';
import { CONTROLLED_SECTIONS, ControlledSection, SectionController } from './SectionController';

import { IIIDM, IIIDMCore } from '@/IIIDM';
import { OnLoadCompleteAction, OnLoadProgressAction } from '@/IIIDM/workers';

type OnHideTitleAction = (opacityScore: number) => void;

type SetSectionAction = (section: ControlledSection) => void;

type SetSectionProgressAction = (sectionProgress: number) => void;

type SectionActivateAction = () => void;

export class MotorcycleIIIDM extends IIIDM {
  private motorcycleVelocity = SECTION_DATA.loading.motorcycle.velocity.initialValue;
  private titleOpacityScore = 1;
  private titleOpacityScoreSub = SECTION_DATA.loading.title.opacityScore.sub.initialValue;
  private activeCameraLookAt = new Vector3().copy(SECTION_DATA.loading.camera.lookAt);
  private sectionController: SectionController;
  private motorcycleModel: Group<Object3DEventMap> | null = null;
  private batteryModel: Object3D<Object3DEventMap> | null = null;
  private mcuModel: Object3D<Object3DEventMap> | null = null;
  private _routeSectionTarget: ControlledSection | null = null;

  private _onHideTitleAction: OnHideTitleAction | null = null;
  private _setSectionAction: SetSectionAction | null = null;
  private _setSectionProgressAction: SetSectionProgressAction | null = null;
  private _onSpecSectionActivateAction: SectionActivateAction | null = null;
  private _onSpecSectionDeactivateAction: SectionActivateAction | null = null;
  private _onBatterySectionActivateAction: SectionActivateAction | null = null;
  private _onBatterySectionDeactivateAction: SectionActivateAction | null = null;
  private _onBMSSectionActivateAction: SectionActivateAction | null = null;
  private _onBMSSectionDeactivateAction: SectionActivateAction | null = null;
  private _onMCUSectionActivateAction: SectionActivateAction | null = null;
  private _onMCUSectionDeactivateAction: SectionActivateAction | null = null;
  private _onElectricMotorSectionActivateAction: SectionActivateAction | null = null;
  private _onElectricMotorSectionDeactivateAction: SectionActivateAction | null = null;
  private _onRegenerativeBrakingSectionActivateAction: SectionActivateAction | null = null;
  private _onRegenerativeBrakingSectionDeactivateAction: SectionActivateAction | null = null;
  private _onUserReviewSectionActivateAction: SectionActivateAction | null = null;
  private _onUserReviewSectionDeactivateAction: SectionActivateAction | null = null;
  private _onDetailSectionActivateAction: SectionActivateAction | null = null;
  private _onDetailSectionDeactivateAction: SectionActivateAction | null = null;

  /**
   * NOTE: At constructing
   * - Set section type.
   * - Set background color.
   * - Create ground mirror, smoke effect.
   * - Set active camera properties.
   * - Add ground mirror, smoke effect.
   */
  constructor(core: IIIDMCore) {
    super(core);

    this.frameManager.initialize();
    this.controlManager.initialize();

    this.sectionController = new SectionController({
      spec: {
        activate: this.onSpecSectionActivate.bind(this),
        deactivate: this.onSpecSectionDeactivate.bind(this),
      },
      battery: {
        activate: this.onBatterySectionActivate.bind(this),
        deactivate: this.onBatterySectionDeactivate.bind(this),
      },
      bms: {
        activate: this.onBMSSectionActivate.bind(this),
        deactivate: this.onBMSSectionDeactivate.bind(this),
      },
      mcu: {
        activate: this.onMCUSectionActivate.bind(this),
        deactivate: this.onMCUSectionDeactivate.bind(this),
      },
      electricMotor: {
        activate: this.onElectricMotorSectionActivate.bind(this),
        deactivate: this.onElectricMotorSectionDeactivate.bind(this),
      },
      regenerativeBraking: {
        activate: this.onRegenerativeBrakingSectionActivate.bind(this),
        deactivate: this.onRegenerativeBrakingSectionDeactivate.bind(this),
      },
      userReview: {
        activate: this.onUserReviewSectionActivate.bind(this),
        deactivate: this.onUserReviewSectionDeactivate.bind(this),
      },
      detail: {
        activate: this.onDetailSectionActivate.bind(this),
        deactivate: this.onDetailSectionDeactivate.bind(this),
      },
    });

    this.activeScene.background = this.getHexColorCode(
      SECTION_DATA.loading.background.colorCode.startCode
    );

    const smoke = new Smoke(
      SECTION_DATA.loading.objectName.smoke,
      SECTION_DATA.loading.smoke.opacity.initialValue,
      SECTION_DATA.loading.smoke.opacity.additionalValue,
      SECTION_DATA.loading.smoke.rotation.additionalValue
    );

    const groundMirror = new GroundMirror(
      this.canvas.clientWidth,
      this.canvas.clientHeight,
      this.getHexColorCode(SECTION_DATA.loading.groundMirror.colorCode.startCode),
      SECTION_DATA.loading.groundMirror.name
    );

    this.activeCamera.position.add(SECTION_DATA.loading.camera.position);
    this.activeCamera.lookAt(this.activeCameraLookAt);

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

  set onHideTitleAction(action: OnHideTitleAction) {
    this._onHideTitleAction = action;
  }

  set setSectionAction(action: SetSectionAction) {
    this._setSectionAction = action;
  }

  set setSectionProgressAction(action: SetSectionProgressAction) {
    this._setSectionProgressAction = action;
  }

  set routeSectionTarget(target: ControlledSection | null) {
    this._routeSectionTarget = target;
  }

  set onSpecSectionActivateAction(action: SectionActivateAction) {
    this._onSpecSectionActivateAction = action;
  }

  set onSpecSectionDeactivateAction(action: SectionActivateAction) {
    this._onSpecSectionDeactivateAction = action;
  }

  set onBatterySectionActivateAction(action: SectionActivateAction) {
    this._onBatterySectionActivateAction = action;
  }

  set onBatterySectionDeactivateAction(action: SectionActivateAction) {
    this._onBatterySectionDeactivateAction = action;
  }

  set onBMSSectionActivateAction(action: SectionActivateAction) {
    this._onBMSSectionActivateAction = action;
  }

  set onBMSSectionDeactivateAction(action: SectionActivateAction) {
    this._onBMSSectionDeactivateAction = action;
  }

  set onMCUSectionActivateAction(action: SectionActivateAction) {
    this._onMCUSectionActivateAction = action;
  }

  set onMCUSectionDeactivateAction(action: SectionActivateAction) {
    this._onMCUSectionDeactivateAction = action;
  }

  set onElectricMotorSectionActivateAction(action: SectionActivateAction) {
    this._onElectricMotorSectionActivateAction = action;
  }

  set onElectricMotorSectionDeactivateAction(action: SectionActivateAction) {
    this._onElectricMotorSectionDeactivateAction = action;
  }

  set onRegenerativeBrakingSectionActivateAction(action: SectionActivateAction) {
    this._onRegenerativeBrakingSectionActivateAction = action;
  }

  set onRegenerativeBrakingSectionDeactivateAction(action: SectionActivateAction) {
    this._onRegenerativeBrakingSectionDeactivateAction = action;
  }

  set onUserReviewSectionActivateAction(action: SectionActivateAction) {
    this._onUserReviewSectionActivateAction = action;
  }

  set onUserReviewSectionDeactivateAction(action: SectionActivateAction) {
    this._onUserReviewSectionDeactivateAction = action;
  }

  set onDetailSectionActivateAction(action: SectionActivateAction) {
    this._onDetailSectionActivateAction = action;
  }

  set onDetailSectionDeactivateAction(action: SectionActivateAction) {
    this._onDetailSectionDeactivateAction = action;
  }

  // NOTE: Loading Section.
  private async loadMotorcycle() {
    try {
      const [motorcycleModel, batteryModel, mcuModel, batteryModelSolo, mcuModelSolo] =
        await Promise.all(
          SECTION_DATA.loading.motorcycle.paths.map(path => this.resourceWorker.loadResource(path))
        );

      this.batteryModel = batteryModelSolo.scene.children[0];
      this.batteryModel.rotateX((Math.PI / 180) * 90);
      this.batteryModel.rotateZ(-Math.PI / 2);
      this.batteryModel.position.add(new Vector3(0, -0.05, 0));
      this.batteryModel.name = SECTION_DATA.loading.objectName.batteryModelSolo;

      this.mcuModel = mcuModelSolo.scene;
      this.mcuModel.position.add(new Vector3(-0.8, -1.25, 0));
      this.mcuModel.name = SECTION_DATA.loading.objectName.mcuModelSolo;

      batteryModel.scene.name = SECTION_DATA.loading.objectName.batteryModel;
      mcuModel.scene.name = SECTION_DATA.loading.objectName.mcuModel;

      motorcycleModel.scene.add(batteryModel.scene, mcuModel.scene);
      motorcycleModel.scene.traverse(object => {
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
      motorcycleModel.scene.position.add(SECTION_DATA.loading.motorcycle.position);
      motorcycleModel.scene.name = SECTION_DATA.loading.objectName.motorcycleModel;

      this.motorcycleModel = motorcycleModel.scene;

      console.info('motorcycleModel', motorcycleModel);
      this.animationManager.initialize(this.motorcycleModel, this.motorcycleModel.animations[0]);

      this.addObjectsToScene(true, motorcycleModel.scene);
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

      if (this.frameManager.isActive) return;

      this.frameManager.activate();
    });
  }

  private showMotorcycle() {
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
          if (object.name === SECTION_DATA.loading.objectName.motorcycleModel) {
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

      if (this.frameManager.isActive) return;

      this.frameManager.activate();
    });
  }

  private async startTheEngine() {
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
        object.material.emissive = SECTION_DATA.loading.motorcycle.headLight.emissiveColor;
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

    return new Promise<void>(resolve => {
      this.frameManager.customRender = () => {
        this.renderer.clear();

        this.activeCamera.layers.set(SECTION_DATA.loading.bloomEffect.layerDepth);

        bloomEffectComposer.render();

        this.renderer.clearDepth();

        this.activeCamera.layers.set(0);

        finalEffectComposer.render();
      };

      const declineEngineLight = () => {
        bloomPass.strength -= 0.03;

        if (bloomPass.strength <= 0) {
          this.frameManager.removeFrameUpdateAction(declineEngineLight.name);
          this.frameManager.customRender = null;
          this.renderer.autoClear = true;

          return resolve();
        }
      };

      this.frameManager.addFrameUpdateAction({
        name: declineEngineLight.name,
        action: declineEngineLight.bind(this),
      });

      if (this.frameManager.isActive) return;

      this.frameManager.activate();
    });
  }

  // NOTE: Common Section.
  // NOTE: Move camera POV from active to prev controlled section.
  private moveCameraPOVToPrev() {
    const {
      prevControlledSection,
      activeControlledSection,
      nextControlledSection,
      controlledSectionInfo,
      prev,
    } = this.sectionController;

    if (activeControlledSection === 'loading') throw this.logWorker.error('Invalid section.');

    if (!this._setSectionAction) throw this.logWorker.error('setSectionAction is must set.');

    if (!this._setSectionProgressAction)
      throw this.logWorker.error('setSectionProgressAction is must set.');

    if (!prevControlledSection && nextControlledSection) {
      const aForthTotalCameraXPosition =
        Math.abs(
          SECTION_DATA[nextControlledSection].camera.position.x -
            SECTION_DATA[activeControlledSection].camera.position.x
        ) / 4;

      const leftCameraXPosition = Math.abs(
        this.activeCamera.position.x - SECTION_DATA[activeControlledSection].camera.position.x
      );

      if (leftCameraXPosition >= aForthTotalCameraXPosition * 3) {
        controlledSectionInfo[nextControlledSection].activate?.();
      } else if (
        leftCameraXPosition < aForthTotalCameraXPosition * 3 &&
        leftCameraXPosition >= aForthTotalCameraXPosition
      ) {
        controlledSectionInfo[nextControlledSection].deactivate?.();
      } else {
        controlledSectionInfo[activeControlledSection].activate?.();
      }

      if (
        leftCameraXPosition >=
        controlledSectionInfo[nextControlledSection].positionAdditionalVector.x
      ) {
        this.activeCamera.position.sub(
          controlledSectionInfo[nextControlledSection].positionAdditionalVector
        );
        this.activeCameraLookAt.sub(
          controlledSectionInfo[nextControlledSection].lookAtAdditionalVector
        );
        this.activeCamera.lookAt(this.activeCameraLookAt);
        this.activeCamera.updateProjectionMatrix();

        this._setSectionProgressAction(
          (leftCameraXPosition / (aForthTotalCameraXPosition * 4)) * 100
        );
      } else {
        this.activeCamera.position.set(
          SECTION_DATA[activeControlledSection].camera.position.x,
          SECTION_DATA[activeControlledSection].camera.position.y,
          SECTION_DATA[activeControlledSection].camera.position.z
        );
        this.activeCameraLookAt.set(
          SECTION_DATA[activeControlledSection].camera.lookAt.x,
          SECTION_DATA[activeControlledSection].camera.lookAt.y,
          SECTION_DATA[activeControlledSection].camera.lookAt.z
        );
        this.activeCamera.lookAt(this.activeCameraLookAt);
        this.activeCamera.updateProjectionMatrix();

        this._setSectionProgressAction(0);
      }

      return;
    }

    if (prevControlledSection && nextControlledSection) {
      const aForthTotalCameraXPosition =
        Math.abs(
          SECTION_DATA[nextControlledSection].camera.position.x -
            SECTION_DATA[activeControlledSection].camera.position.x
        ) / 4;

      const leftCameraXPosition = Math.abs(
        this.activeCamera.position.x - SECTION_DATA[activeControlledSection].camera.position.x
      );

      if (leftCameraXPosition >= aForthTotalCameraXPosition * 3) {
        controlledSectionInfo[nextControlledSection].activate?.();
      } else if (
        leftCameraXPosition < aForthTotalCameraXPosition * 3 &&
        leftCameraXPosition >= aForthTotalCameraXPosition
      ) {
        controlledSectionInfo[nextControlledSection].deactivate?.();
      } else {
        controlledSectionInfo[activeControlledSection].activate?.();
      }

      if (
        leftCameraXPosition >=
        Math.abs(controlledSectionInfo[nextControlledSection].positionAdditionalVector.x)
      ) {
        this.activeCamera.position.sub(
          controlledSectionInfo[nextControlledSection].positionAdditionalVector
        );
        this.activeCameraLookAt.sub(
          controlledSectionInfo[nextControlledSection].lookAtAdditionalVector
        );
        this.activeCamera.lookAt(this.activeCameraLookAt);
        this.activeCamera.updateProjectionMatrix();

        this._setSectionProgressAction(
          (leftCameraXPosition / (aForthTotalCameraXPosition * 4)) * 100
        );
      } else {
        this.activeCamera.position.set(
          SECTION_DATA[activeControlledSection].camera.position.x,
          SECTION_DATA[activeControlledSection].camera.position.y,
          SECTION_DATA[activeControlledSection].camera.position.z
        );
        this.activeCameraLookAt.set(
          SECTION_DATA[activeControlledSection].camera.lookAt.x,
          SECTION_DATA[activeControlledSection].camera.lookAt.y,
          SECTION_DATA[activeControlledSection].camera.lookAt.z
        );
        this.activeCamera.lookAt(this.activeCameraLookAt);
        this.activeCamera.updateProjectionMatrix();

        prev.bind(this.sectionController)();

        this._setSectionProgressAction(100);
        this._setSectionAction(prevControlledSection);
      }

      return;
    }

    if (prevControlledSection && !nextControlledSection) {
      const aForthTotalCameraXPosition =
        Math.abs(
          SECTION_DATA[activeControlledSection].camera.position.x -
            SECTION_DATA[prevControlledSection].camera.position.x
        ) / 4;

      this.activeCamera.position.sub(
        controlledSectionInfo[activeControlledSection].positionAdditionalVector
      );
      this.activeCameraLookAt.sub(
        controlledSectionInfo[activeControlledSection].lookAtAdditionalVector
      );
      this.activeCamera.lookAt(this.activeCameraLookAt);
      this.activeCamera.updateProjectionMatrix();

      const leftCameraXPosition = Math.abs(
        this.activeCamera.position.x - SECTION_DATA[prevControlledSection].camera.position.x
      );

      controlledSectionInfo[activeControlledSection].activate?.();

      prev.bind(this.sectionController)();

      this._setSectionProgressAction(
        (leftCameraXPosition / (aForthTotalCameraXPosition * 4)) * 100
      );
      this._setSectionAction(activeControlledSection);

      return;
    }
  }

  // NOTE: Move camera POV from active to next controlled section.
  private moveCameraPOVToNext() {
    const { activeControlledSection, nextControlledSection, controlledSectionInfo, next } =
      this.sectionController;

    if (!this._setSectionProgressAction)
      throw this.logWorker.error('setSectionProgressAction is must set.');

    if (!this._setSectionAction) throw this.logWorker.error('setSectionAction is must set.');

    if (!nextControlledSection) {
      this.activeCamera.position.set(
        SECTION_DATA[activeControlledSection].camera.position.x,
        SECTION_DATA[activeControlledSection].camera.position.y,
        SECTION_DATA[activeControlledSection].camera.position.z
      );
      this.activeCameraLookAt.set(
        SECTION_DATA[activeControlledSection].camera.lookAt.x,
        SECTION_DATA[activeControlledSection].camera.lookAt.y,
        SECTION_DATA[activeControlledSection].camera.lookAt.z
      );
      this.activeCamera.lookAt(this.activeCameraLookAt);
      this.activeCamera.updateProjectionMatrix();

      this._setSectionAction('detail');
      this._setSectionProgressAction(100);

      return;
    }

    const aForthTotalCameraXPosition = Math.abs(
      (SECTION_DATA[nextControlledSection].camera.position.x -
        SECTION_DATA[activeControlledSection].camera.position.x) /
        4
    );

    const leftCameraXPosition = Math.abs(
      SECTION_DATA[nextControlledSection].camera.position.x - this.activeCamera.position.x
    );

    // NOTE: Execute active section function.
    if (activeControlledSection === 'loading') {
      if (leftCameraXPosition <= aForthTotalCameraXPosition) {
        controlledSectionInfo[nextControlledSection].activate?.();
      }
    } else {
      if (leftCameraXPosition >= aForthTotalCameraXPosition * 3) {
        controlledSectionInfo[activeControlledSection].activate?.();
      } else if (
        leftCameraXPosition < aForthTotalCameraXPosition * 3 &&
        leftCameraXPosition >= aForthTotalCameraXPosition
      ) {
        controlledSectionInfo[activeControlledSection].deactivate?.();
      } else {
        controlledSectionInfo[nextControlledSection].activate?.();
      }
    }

    if (
      leftCameraXPosition >
      Math.abs(controlledSectionInfo[nextControlledSection].positionAdditionalVector.x)
    ) {
      this.activeCamera.position.add(
        controlledSectionInfo[nextControlledSection].positionAdditionalVector
      );
      this.activeCameraLookAt.add(
        controlledSectionInfo[nextControlledSection].lookAtAdditionalVector
      );
      this.activeCamera.lookAt(this.activeCameraLookAt);
      this.activeCamera.updateProjectionMatrix();

      this._setSectionProgressAction(
        ((aForthTotalCameraXPosition * 4 - leftCameraXPosition) /
          (aForthTotalCameraXPosition * 4)) *
          100
      );
    } else {
      this.activeCamera.position.set(
        SECTION_DATA[nextControlledSection].camera.position.x,
        SECTION_DATA[nextControlledSection].camera.position.y,
        SECTION_DATA[nextControlledSection].camera.position.z
      );
      this.activeCameraLookAt.set(
        SECTION_DATA[nextControlledSection].camera.lookAt.x,
        SECTION_DATA[nextControlledSection].camera.lookAt.y,
        SECTION_DATA[nextControlledSection].camera.lookAt.z
      );
      this.activeCamera.lookAt(this.activeCameraLookAt);
      this.activeCamera.updateProjectionMatrix();
      next.bind(this.sectionController)();

      this._setSectionAction(nextControlledSection);
      this._setSectionProgressAction(0);
    }
  }

  // NOTE: Move camera POV to target section.
  changePOVToTargetSection(targetSection: ControlledSection) {
    const {
      activeControlledSection,
      controlledSectionInfo,
      getAdditionalVector,
      changeActiveControlledSection,
    } = this.sectionController;
    // NOTE: If target section is active section, return.
    if (targetSection === activeControlledSection) return;

    if (activeControlledSection === 'loading')
      throw this.logWorker.error(
        'Change POV to target section can not executed on loading section.'
      );

    // NOTE: Calculate additional vector for camera position and lookAt.
    const targetSectionCameraPositionAdditionalVector = getAdditionalVector(
      this.activeCamera.position,
      SECTION_DATA[targetSection].camera.position,
      SECTION_DATA[targetSection].camera.targetChangeCount
    );
    const targetSectionLookAtAdditionalVector = getAdditionalVector(
      this.activeCameraLookAt,
      SECTION_DATA[targetSection].camera.lookAt,
      SECTION_DATA[targetSection].camera.targetChangeCount
    );

    const totalCameraXPosition = Math.abs(
      SECTION_DATA[targetSection].camera.position.x - this.activeCamera.position.x
    );
    const activeControlledSectionIndex = CONTROLLED_SECTIONS.indexOf(activeControlledSection);
    const targetSectionIndex = CONTROLLED_SECTIONS.indexOf(targetSection);
    const dividedCameraXPosition =
      totalCameraXPosition / Math.abs(targetSectionIndex - activeControlledSectionIndex);
    const changeSectionDirection =
      targetSectionIndex - activeControlledSectionIndex > 0 ? 'PLUS' : 'MINUS';
    let currentSectionIndex = activeControlledSectionIndex;

    // NOTE: Deactivate all of section.
    controlledSectionInfo.spec.deactivate?.();
    controlledSectionInfo.battery.deactivate?.();
    controlledSectionInfo.bms.deactivate?.();
    controlledSectionInfo.mcu.deactivate?.();
    controlledSectionInfo.electricMotor.deactivate?.();
    controlledSectionInfo.regenerativeBraking.deactivate?.();
    controlledSectionInfo.userReview.deactivate?.();
    controlledSectionInfo.detail.deactivate?.();

    const moveCameraToTargetSection = () => {
      if (!this._setSectionProgressAction)
        throw this.logWorker.error('setSectionProgressAction is must set.');

      if (!this._setSectionAction) throw this.logWorker.error('setSectionAction is must set.');

      const leftCameraXPosition = Math.abs(
        this.activeCamera.position.x - SECTION_DATA[targetSection].camera.position.x
      );

      if (totalCameraXPosition / 4 >= leftCameraXPosition) {
        controlledSectionInfo[targetSection].activate?.();
      }

      if (leftCameraXPosition > Math.abs(targetSectionCameraPositionAdditionalVector.x)) {
        this.activeCamera.position.add(targetSectionCameraPositionAdditionalVector);
        this.activeCameraLookAt.add(targetSectionLookAtAdditionalVector);
        this.activeCamera.lookAt(this.activeCameraLookAt);
        this.activeCamera.updateProjectionMatrix();

        if (changeSectionDirection === 'PLUS') {
          if (
            leftCameraXPosition <=
            dividedCameraXPosition * Math.abs(targetSectionIndex - currentSectionIndex - 1)
          ) {
            currentSectionIndex += 1;

            this._setSectionAction(CONTROLLED_SECTIONS[currentSectionIndex]);
            changeActiveControlledSection.bind(this.sectionController)(
              CONTROLLED_SECTIONS[currentSectionIndex]
            );
            this._setSectionProgressAction(0);
          } else {
            this._setSectionProgressAction(
              ((dividedCameraXPosition * (targetSectionIndex - currentSectionIndex) -
                leftCameraXPosition) /
                dividedCameraXPosition) *
                100
            );
          }
        } else {
          if (
            leftCameraXPosition <=
            dividedCameraXPosition * Math.abs(currentSectionIndex - targetSectionIndex)
          ) {
            currentSectionIndex -= 1;

            this._setSectionAction(CONTROLLED_SECTIONS[currentSectionIndex]);
            changeActiveControlledSection.bind(this.sectionController)(
              CONTROLLED_SECTIONS[currentSectionIndex]
            );
            this._setSectionProgressAction(100);
          } else {
            this._setSectionProgressAction(
              ((leftCameraXPosition -
                dividedCameraXPosition * (currentSectionIndex - targetSectionIndex)) /
                dividedCameraXPosition) *
                100
            );
          }
        }
      } else {
        this.activeCamera.position.set(
          SECTION_DATA[targetSection].camera.position.x,
          SECTION_DATA[targetSection].camera.position.y,
          SECTION_DATA[targetSection].camera.position.z
        );
        this.activeCameraLookAt.set(
          SECTION_DATA[targetSection].camera.lookAt.x,
          SECTION_DATA[targetSection].camera.lookAt.y,
          SECTION_DATA[targetSection].camera.lookAt.z
        );
        this.activeCamera.lookAt(this.activeCameraLookAt);
        this.activeCamera.updateProjectionMatrix();

        this._setSectionProgressAction(targetSection === 'detail' ? 100 : 0);
        this._setSectionAction(targetSection);
        changeActiveControlledSection.bind(this.sectionController)(targetSection);
        this.frameManager.removeFrameUpdateAction(moveCameraToTargetSection.name);

        return;
      }
    };
    this.frameManager.removeFrameUpdateAction(moveCameraToTargetSection.name);

    this.frameManager.addFrameUpdateAction({
      name: moveCameraToTargetSection.name,
      action: moveCameraToTargetSection.bind(this),
    });

    if (this.frameManager.isActive) return;

    this.frameManager.activate();
  }

  private visibleMotorcycle() {
    let makeCount = 25;

    const motorcycleModel = this.activeScene.getObjectByName(
      SECTION_DATA.loading.objectName.motorcycleModel
    );

    if (!motorcycleModel) return;

    const makeMotorcycleModelVisible = () => {
      if (makeCount <= 0) {
        this.frameManager.removeFrameUpdateAction(makeMotorcycleModelVisible.name);
      }

      motorcycleModel.traverse(object => {
        if (
          object instanceof Mesh &&
          object.isMesh &&
          (object.material instanceof MeshStandardMaterial ||
            object.material instanceof MeshPhysicalMaterial)
        ) {
          if (object.material.opacity < 1) {
            object.material.opacity += 0.05;
          } else {
            object.material.opacity = 1;

            if (object.material.transparent) object.material.transparent = false;
          }
        }
      });

      makeCount -= 1;
    };

    this.frameManager.addFrameUpdateAction({
      name: makeMotorcycleModelVisible.name,
      action: makeMotorcycleModelVisible.bind(this),
    });

    if (this.frameManager.isActive) return;

    this.frameManager.activate();
  }

  private invisibleMotorcycle() {
    let makeCount = 25;

    const motorcycleModel = this.activeScene.getObjectByName(
      SECTION_DATA.loading.objectName.motorcycleModel
    );

    if (!motorcycleModel) return;

    const makeMotorcycleModelInvisible = () => {
      if (makeCount <= 0) {
        this.frameManager.removeFrameUpdateAction(makeMotorcycleModelInvisible.name);
      }

      motorcycleModel.traverse(object => {
        if (
          object instanceof Mesh &&
          object.isMesh &&
          (object.material instanceof MeshStandardMaterial ||
            object.material instanceof MeshPhysicalMaterial)
        ) {
          if (!object.material.transparent) object.material.transparent = true;

          if (object.material.opacity > 0) {
            object.material.opacity -= 0.05;
          } else {
            object.material.opacity = 0;
          }
        }
      });

      makeCount -= 1;
    };

    this.frameManager.addFrameUpdateAction({
      name: makeMotorcycleModelInvisible.name,
      action: makeMotorcycleModelInvisible.bind(this),
    });

    if (this.frameManager.isActive) return;

    this.frameManager.activate();
  }

  private showBattery() {
    if (!this.batteryModel) return;

    this.addObjectsToScene(true, this.batteryModel);
  }

  private unshowBattery() {
    console.info('Unshow Battery');
    console.info(this.batteryModel);
    this.removeObjectsFromScene(true, SECTION_DATA.loading.objectName.batteryModelSolo);
  }

  private showMCU() {
    if (!this.mcuModel) return;

    this.addObjectsToScene(true, this.mcuModel);
  }

  private unshowMCU() {
    this.removeObjectsFromScene(true, SECTION_DATA.loading.objectName.mcuModelSolo);
  }

  // NOTE: Spec Section.
  private turnOnStage() {
    return new Promise<void>(resolve => {
      const directionalLightA = new DirectionalLight(0xffffff, 0);
      directionalLightA.position.set(5, 5, 5);
      directionalLightA.name = 'directionalLightA';
      const directionalLightB = new DirectionalLight(0xffffff, 0);
      directionalLightB.position.set(-5, 5, 5);
      directionalLightB.name = 'directionalLightB';
      const directionalLightC = new DirectionalLight(0xffffff, 0);
      directionalLightC.position.set(5, -5, 5);
      directionalLightC.name = 'directionalLightC';
      const directionalLightD = new DirectionalLight(0xffffff, 0);
      directionalLightD.position.set(-5, -5, 5);
      directionalLightD.name = 'directionalLightD';

      const ambientLight = new AmbientLight(0xffffff, 1);

      this.activeScene.traverse(object => {
        if (object.name === SECTION_DATA.loading.objectName.motorcycleModel) {
          object.add(ambientLight);
        }
      });

      this.addObjectsToScene(
        false,
        directionalLightA,
        directionalLightB,
        directionalLightC,
        directionalLightD
      );

      const turnOnTheLight = () => {
        this.activeScene.traverse(object => {
          if (object instanceof DirectionalLight) {
            if (object.name === SECTION_DATA.loading.objectName.directionalLight) {
              if (object.intensity >= 0) {
                object.intensity -= 0.2;
              }
            }

            if (
              object.name === 'directionalLightA' ||
              object.name === 'directionalLightB' ||
              object.name === 'directionalLightC' ||
              object.name === 'directionalLightD'
            ) {
              if (object.intensity <= 1.5) {
                object.intensity += 0.2;
              } else {
                this.frameManager.removeFrameUpdateAction(turnOnTheLight.name);

                return resolve();
              }
            }
          }
        });
      };

      this.frameManager.addFrameUpdateAction({
        name: turnOnTheLight.name,
        action: turnOnTheLight.bind(this),
      });

      if (this.frameManager.isActive) return;

      this.frameManager.activate();
    });
  }

  private turnOnColor() {
    return new Promise<void>(resolve => {
      const backgroundColorDiff =
        SECTION_DATA.loading.background.colorCode.endCode -
        SECTION_DATA.loading.background.colorCode.startCode;
      const groundMirrorColorDiff =
        SECTION_DATA.loading.groundMirror.colorCode.endCode -
        SECTION_DATA.loading.groundMirror.colorCode.startCode;
      const colorDiff =
        backgroundColorDiff >= groundMirrorColorDiff ? backgroundColorDiff : groundMirrorColorDiff;

      const groundMirrorObject = this.activeScene.getObjectByName(
        SECTION_DATA.loading.objectName.groundMirror
      );

      if (!groundMirrorObject) throw this.logWorker.error('Ground mirror object is not found.');

      let colorAddCount = 1;

      const addColor = () => {
        if (colorAddCount <= colorDiff) {
          const backgroundColorCode =
            SECTION_DATA.loading.background.colorCode.startCode + colorAddCount;
          const groundMirrorColorCode =
            SECTION_DATA.loading.groundMirror.colorCode.startCode + colorAddCount;

          if (backgroundColorCode <= SECTION_DATA.loading.background.colorCode.endCode) {
            this.activeScene.background = this.getHexColorCode(backgroundColorCode);
          }

          if (groundMirrorColorCode <= SECTION_DATA.loading.groundMirror.colorCode.endCode) {
            if (groundMirrorObject instanceof Mesh && groundMirrorObject.isMesh) {
              groundMirrorObject.material.color = this.getHexColorCode(groundMirrorColorCode);
            }
          }

          colorAddCount += 1;
        } else {
          this.frameManager.removeFrameUpdateAction(addColor.name);

          return resolve();
        }
      };

      this.frameManager.addFrameUpdateAction({
        name: addColor.name,
        action: addColor.bind(this),
      });

      if (this.frameManager.isActive) return;

      this.frameManager.activate();
    });
  }

  private changePOVToSpecSection() {
    return new Promise<void>(resolve => {
      const moveCameraToSpecSection = () => {
        const { activeControlledSection } = this.sectionController;

        if (activeControlledSection === 'spec') {
          this.frameManager.removeFrameUpdateAction(moveCameraToSpecSection.name);

          return resolve();
        }

        this.moveCameraPOVToNext();
      };

      this.frameManager.addFrameUpdateAction({
        name: moveCameraToSpecSection.name,
        action: moveCameraToSpecSection.bind(this),
      });

      if (this.frameManager.isActive) return;

      this.frameManager.activate();
    });
  }

  private onSpecSectionActivate() {
    const { controlledSectionInfo } = this.sectionController;

    if (controlledSectionInfo.spec.isActive) return;

    this._onSpecSectionActivateAction?.();

    controlledSectionInfo.spec.isActive = true;
  }

  private onSpecSectionDeactivate() {
    const { controlledSectionInfo } = this.sectionController;

    if (!controlledSectionInfo.spec.isActive) return;

    this._onSpecSectionDeactivateAction?.();

    controlledSectionInfo.spec.isActive = false;
  }

  // NOTE: Battery Section.
  private onBatterySectionActivate() {
    const { controlledSectionInfo } = this.sectionController;

    if (controlledSectionInfo.battery.isActive) return;

    this.activeScene.traverse(object => {
      if (object.name === SECTION_DATA.loading.objectName.motorcycleModel) {
        object.children
          .filter(child => child.name !== 'batteryModel' && child.name !== 'mcuModel')
          .map(child =>
            child.traverse(grandChild => {
              if (
                grandChild instanceof Mesh &&
                grandChild.isMesh &&
                (grandChild.material instanceof MeshStandardMaterial ||
                  grandChild.material instanceof MeshPhysicalMaterial)
              ) {
                grandChild.material.wireframe = true;
              }
            })
          );
      }
    });

    this._onBatterySectionActivateAction?.();

    controlledSectionInfo.battery.isActive = true;
  }

  private onBatterySectionDeactivate() {
    const { controlledSectionInfo } = this.sectionController;

    if (!controlledSectionInfo.battery.isActive) return;

    this.activeScene.traverse(object => {
      if (object.name === SECTION_DATA.loading.objectName.motorcycleModel) {
        object.children
          .filter(child => child.name !== 'batteryModel' && child.name !== 'mcuModel')
          .map(child =>
            child.traverse(grandChild => {
              if (
                grandChild instanceof Mesh &&
                grandChild.isMesh &&
                (grandChild.material instanceof MeshStandardMaterial ||
                  grandChild.material instanceof MeshPhysicalMaterial)
              ) {
                grandChild.material.wireframe = false;
              }
            })
          );
      }
    });

    this._onBatterySectionDeactivateAction?.();

    controlledSectionInfo.battery.isActive = false;
  }

  // NOTE: BMS Section.
  private onBMSSectionActivate() {
    const { controlledSectionInfo } = this.sectionController;

    if (controlledSectionInfo.bms.isActive) return;

    this.invisibleMotorcycle();
    this.showBattery();

    this._onBMSSectionActivateAction?.();

    controlledSectionInfo.bms.isActive = true;
  }

  private onBMSSectionDeactivate() {
    const { controlledSectionInfo } = this.sectionController;

    if (!controlledSectionInfo.bms.isActive) return;

    this.visibleMotorcycle();
    this.unshowBattery();

    this._onBMSSectionDeactivateAction?.();

    controlledSectionInfo.bms.isActive = false;
  }

  // NOTE: MCU Section.
  private onMCUSectionActivate() {
    const { controlledSectionInfo } = this.sectionController;

    if (controlledSectionInfo.mcu.isActive) return;

    this.invisibleMotorcycle();
    this.showMCU();

    this._onMCUSectionActivateAction?.();

    controlledSectionInfo.mcu.isActive = true;
  }

  private onMCUSectionDeactivate() {
    const { controlledSectionInfo } = this.sectionController;

    if (!controlledSectionInfo.mcu.isActive) return;

    this.visibleMotorcycle();
    this.unshowMCU();

    this._onMCUSectionDeactivateAction?.();

    controlledSectionInfo.mcu.isActive = false;
  }

  // NOTE: Electric Motor Section.
  private onElectricMotorSectionActivate() {
    const { controlledSectionInfo } = this.sectionController;

    if (controlledSectionInfo.electricMotor.isActive) return;

    this.animationManager.activate();

    this._onElectricMotorSectionActivateAction?.();

    controlledSectionInfo.electricMotor.isActive = true;
  }

  private onElectricMotorSectionDeactivate() {
    const { controlledSectionInfo } = this.sectionController;

    if (!controlledSectionInfo.electricMotor.isActive) return;

    this._onElectricMotorSectionDeactivateAction?.();

    controlledSectionInfo.electricMotor.isActive = false;
  }

  // NOTE: Regenerative Braking Section.
  private onRegenerativeBrakingSectionActivate() {
    const { controlledSectionInfo } = this.sectionController;

    if (controlledSectionInfo.regenerativeBraking.isActive) return;

    this._onRegenerativeBrakingSectionActivateAction?.();

    controlledSectionInfo.regenerativeBraking.isActive = true;
  }

  private onRegenerativeBrakingSectionDeactivate() {
    const { controlledSectionInfo } = this.sectionController;

    if (!controlledSectionInfo.regenerativeBraking.isActive) return;

    this._onRegenerativeBrakingSectionDeactivateAction?.();

    controlledSectionInfo.regenerativeBraking.isActive = false;
  }

  // NOTE: User Review Section.
  private onUserReviewSectionActivate() {
    const { controlledSectionInfo } = this.sectionController;

    if (controlledSectionInfo.userReview.isActive) return;

    this._onUserReviewSectionActivateAction?.();

    controlledSectionInfo.userReview.isActive = true;
  }

  private onUserReviewSectionDeactivate() {
    const { controlledSectionInfo } = this.sectionController;

    if (!controlledSectionInfo.userReview.isActive) return;

    this._onUserReviewSectionDeactivateAction?.();

    controlledSectionInfo.userReview.isActive = false;
  }

  // NOTE: Detail Section.
  private onDetailSectionActivate() {
    const { controlledSectionInfo } = this.sectionController;

    if (controlledSectionInfo.detail.isActive) return;

    this.controlManager.activate();
    this.controlManager.orbitControl.target = this.activeCameraLookAt;
    this.controlManager.orbitControl.enableZoom = false;
    this.controlManager.orbitControl.update();
    this.controlManager.orbitControl.addEventListener('change', this.render.bind(this));

    this._onDetailSectionActivateAction?.();

    controlledSectionInfo.detail.isActive = true;
  }

  private onDetailSectionDeactivate() {
    const { controlledSectionInfo } = this.sectionController;

    if (!controlledSectionInfo.detail.isActive) return;

    this.controlManager.orbitControl.removeEventListener('change', this.render.bind(this));
    this.controlManager.deactivate();

    this._onDetailSectionDeactivateAction?.();

    controlledSectionInfo.detail.isActive = false;
  }

  // NOTE: Common Utils.
  private getHexColorCode(colorCode: number) {
    const convertedColorCode = colorCode < 10 ? `0${colorCode}` : `${colorCode}`;

    return new Color(`#${convertedColorCode}${convertedColorCode}${convertedColorCode}`);
  }

  resize() {
    this.onResize();

    this.render();
  }

  render() {
    this.onRender();
  }

  scroll(wheelEvent: WheelEvent) {
    const { activeControlledSection } = this.sectionController;

    if (activeControlledSection === 'loading') {
      this.logWorker.warn('Scroll event is not available in this section.');

      return;
    }

    if (wheelEvent.deltaY > 0) this.moveCameraPOVToNext();
    else this.moveCameraPOVToPrev();

    this.render();
  }

  /**
   * NOTE: For manage POV.
   * TODO: Remove this after set POV.
   */
  private updateControl() {
    this.controlManager.orbitControl.target = this.activeCameraLookAt;
    this.controlManager.orbitControl.update();
    this.activeCamera.lookAt(this.activeCameraLookAt);

    this.activeCamera.updateProjectionMatrix();
  }

  /**
   * NOTE: For manage POV.
   * TODO: Remove this after set POV.
   */
  private povHelper() {
    const povPositionFolder = this.GUIManager.gui.addFolder('POV position');

    povPositionFolder.add(this.activeCamera.position, 'x', -10, 10, 0.01);
    povPositionFolder.add(this.activeCamera.position, 'y', -10, 10, 0.01);
    povPositionFolder.add(this.activeCamera.position, 'z', -10, 10, 0.01);

    const povLookAtFolder = this.GUIManager.gui.addFolder('POV lookAt');

    povLookAtFolder.add(this.activeCameraLookAt, 'x', -10, 10, 0.01);
    povLookAtFolder.add(this.activeCameraLookAt, 'y', -10, 10, 0.01);
    povLookAtFolder.add(this.activeCameraLookAt, 'z', -10, 10, 0.01);

    this.GUIManager.gui.open();

    this.controlManager.orbitControl.target = this.activeCameraLookAt;
    this.controlManager.orbitControl.update();
    this.controlManager.activate();

    this.frameManager.addFrameUpdateAction({
      name: this.updateControl.name,
      action: this.updateControl.bind(this),
    });

    if (this.frameManager.isActive) return;

    this.frameManager.activate();
  }

  async activate() {
    this.onActivate();

    // NOTE: Load Model
    await this.loadMotorcycle();

    // NOTE: Loading Section
    await this.hideTitle();

    this.showMotorcycle();

    await this.closerMotorcycle();

    await this.startTheEngine();

    setTimeout(async () => {
      await Promise.all([this.turnOnStage(), this.turnOnColor()]);
      await this.changePOVToSpecSection();

      if (this._routeSectionTarget) {
        this.changePOVToTargetSection(this._routeSectionTarget);
      }
    }, 800);

    // this.povHelper();
  }

  deactivate() {
    this.onDeactivate();
  }

  dispose() {
    this.onDispose();
  }
}

export * from './resources';
export * from './SectionController';
