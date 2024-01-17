import {
  AmbientLight,
  Color,
  DirectionalLight,
  Layers,
  Mesh,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  ShaderMaterial,
  SpotLight,
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
import { SectionController } from './SectionController';

import { IIIDM, IIIDMCore } from '@/IIIDM';
import { OnLoadCompleteAction, OnLoadProgressAction } from '@/IIIDM/workers';

type onHideTitleAction = (opacityScore: number) => void;

export class MotorcycleIIIDM extends IIIDM {
  private motorcycleVelocity = SECTION_DATA.loading.motorcycle.velocity.initialValue;
  private titleOpacityScore = 1;
  private titleOpacityScoreSub = SECTION_DATA.loading.title.opacityScore.sub.initialValue;
  private _onHideTitleAction: onHideTitleAction | null = null;
  private activeCameraLookAt = new Vector3().copy(SECTION_DATA.loading.camera.lookAt);
  private sectionController: SectionController;
  private isWireframeMode = false;

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

    this.sectionController = new SectionController({
      battery: {
        show: this.showWireframe.bind(this),
        unshow: this.unshowWireframe.bind(this),
      },
    });

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

  set onHideTitleAction(action: onHideTitleAction) {
    this._onHideTitleAction = action;
  }

  private async loadMotorcycle() {
    try {
      const [motorcycleModel, batteryModel, mcuModel] = await Promise.all(
        SECTION_DATA.loading.motorcycle.paths.map(path => this.resourceWorker.loadResource(path))
      );

      batteryModel.scene.name = 'batteryModel';
      mcuModel.scene.name = 'mcuModel';

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
      motorcycleModel.scene.name = SECTION_DATA.loading.objectName.motorcycle;

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

  private moveCameraPOVToPrev() {
    const sectionTypeInfo = this.sectionController.getSectionTypeInfo();
    const sectionCameraInfoMap = this.sectionController.sectionCameraInfoMap;
    const sectionExecutorInfoMap = this.sectionController.sectionExecutorInfoMap;
    if (sectionTypeInfo.active === 'loading' || !sectionTypeInfo.prev) {
      this.logWorker.warn('Scroll event is not available in prev section.');
      return;
    }
    const aForthTotalCameraXPosition = Math.abs(
      sectionTypeInfo.next
        ? (SECTION_DATA[sectionTypeInfo.next].camera.position.x -
            SECTION_DATA[sectionTypeInfo.active].camera.position.x) /
            4
        : (SECTION_DATA[sectionTypeInfo.active].camera.position.x -
            SECTION_DATA[sectionTypeInfo.prev].camera.position.x) /
            4
    );

    const leftCameraXPosition = Math.abs(
      this.activeCamera.position.x - SECTION_DATA[sectionTypeInfo.active].camera.position.x
    );

    const targetCameraInfoMap =
      sectionCameraInfoMap[sectionTypeInfo.active] ?? sectionCameraInfoMap[sectionTypeInfo.prev];

    const percentageOfSection = leftCameraXPosition / (aForthTotalCameraXPosition * 4);

    console.info(
      `[Type] :: ${sectionTypeInfo.active} [Percentage] :: ${percentageOfSection * 100}%`
    );

    if (leftCameraXPosition >= aForthTotalCameraXPosition * 3) {
      sectionExecutorInfoMap[sectionTypeInfo.next ?? sectionTypeInfo.active]?.show();
    } else if (leftCameraXPosition < aForthTotalCameraXPosition * 3 && leftCameraXPosition >= 0) {
      sectionExecutorInfoMap[sectionTypeInfo.next ?? sectionTypeInfo.active]?.unshow();
    } else {
      sectionExecutorInfoMap[sectionTypeInfo.active]?.show();
    }

    if (leftCameraXPosition >= Math.abs(targetCameraInfoMap.positionAdditionalVector.x)) {
      this.activeCamera.position.sub(targetCameraInfoMap.positionAdditionalVector);
      this.activeCameraLookAt.sub(targetCameraInfoMap.lookAtAdditionalVector);
      this.activeCamera.lookAt(this.activeCameraLookAt);
      this.activeCamera.updateProjectionMatrix();
    } else {
      this.activeCamera.position.set(
        SECTION_DATA[sectionTypeInfo.active].camera.position.x,
        SECTION_DATA[sectionTypeInfo.active].camera.position.y,
        SECTION_DATA[sectionTypeInfo.active].camera.position.z
      );
      this.activeCameraLookAt.set(
        SECTION_DATA[sectionTypeInfo.active].camera.lookAt.x,
        SECTION_DATA[sectionTypeInfo.active].camera.lookAt.y,
        SECTION_DATA[sectionTypeInfo.active].camera.lookAt.z
      );
      this.activeCamera.lookAt(this.activeCameraLookAt);
      this.activeCamera.updateProjectionMatrix();
      this.sectionController.prev();
    }
  }

  private moveCameraPOVToNext() {
    const sectionTypeInfo = this.sectionController.getSectionTypeInfo();
    const sectionCameraInfoMap = this.sectionController.sectionCameraInfoMap;
    const sectionExecutorInfoMap = this.sectionController.sectionExecutorInfoMap;

    if (sectionTypeInfo.active === 'detail' || !sectionTypeInfo.next) {
      this.logWorker.warn('Scroll event is not available in next section.');

      return;
    }

    const aForthTotalCameraXPosition = Math.abs(
      (SECTION_DATA[sectionTypeInfo.next].camera.position.x -
        SECTION_DATA[sectionTypeInfo.active].camera.position.x) /
        4
    );

    const leftCameraXPosition = Math.abs(
      SECTION_DATA[sectionTypeInfo.next].camera.position.x - this.activeCamera.position.x
    );

    const percentageOfSection =
      (aForthTotalCameraXPosition * 4 - leftCameraXPosition) / (aForthTotalCameraXPosition * 4);

    console.info(
      `[Type] :: ${sectionTypeInfo.active} [Percentage] :: ${percentageOfSection * 100}%`
    );

    // NOTE: Execute active section function.
    if (leftCameraXPosition >= aForthTotalCameraXPosition * 3) {
      sectionExecutorInfoMap[sectionTypeInfo.active]?.show();
    } else if (
      leftCameraXPosition < aForthTotalCameraXPosition * 3 &&
      leftCameraXPosition >= aForthTotalCameraXPosition
    ) {
      sectionExecutorInfoMap[sectionTypeInfo.active]?.unshow();
    } else {
      sectionExecutorInfoMap[sectionTypeInfo.next]?.show();
    }

    if (
      leftCameraXPosition >
      Math.abs(sectionCameraInfoMap[sectionTypeInfo.active].positionAdditionalVector.x)
    ) {
      this.activeCamera.position.add(
        sectionCameraInfoMap[sectionTypeInfo.active].positionAdditionalVector
      );
      this.activeCameraLookAt.add(
        sectionCameraInfoMap[sectionTypeInfo.active].lookAtAdditionalVector
      );
      this.activeCamera.lookAt(this.activeCameraLookAt);
      this.activeCamera.updateProjectionMatrix();
    } else {
      this.activeCamera.position.set(
        SECTION_DATA[sectionTypeInfo.next].camera.position.x,
        SECTION_DATA[sectionTypeInfo.next].camera.position.y,
        SECTION_DATA[sectionTypeInfo.next].camera.position.z
      );
      this.activeCameraLookAt.set(
        SECTION_DATA[sectionTypeInfo.next].camera.lookAt.x,
        SECTION_DATA[sectionTypeInfo.next].camera.lookAt.y,
        SECTION_DATA[sectionTypeInfo.next].camera.lookAt.z
      );
      this.activeCamera.lookAt(this.activeCameraLookAt);
      this.activeCamera.updateProjectionMatrix();
      this.sectionController.next();
    }
  }

  private removeDirectionalLight() {
    this.removeObjectsFromScene(false, SECTION_DATA.loading.objectName.directionalLight);
  }

  private turnOnTheLight() {
    this.activeScene.background = null;

    const directionalLightA = new DirectionalLight(0xffffff, 1.5);
    directionalLightA.position.set(5, 5, 5);
    directionalLightA.name = 'directionalLightA';
    const directionalLightB = new DirectionalLight(0xffffff, 1.5);
    directionalLightB.position.set(-5, 5, 5);
    directionalLightB.name = 'directionalLightB';
    const directionalLightC = new DirectionalLight(0xffffff, 1.5);
    directionalLightC.position.set(5, -5, 5);
    directionalLightC.name = 'directionalLightC';
    const directionalLightD = new DirectionalLight(0xffffff, 1.5);
    directionalLightD.position.set(-5, -5, 5);
    directionalLightD.name = 'directionalLightD';

    const ambientLight = new AmbientLight(0xffffff, 1);

    this.activeScene.traverse(object => {
      if (object.name === SECTION_DATA.loading.objectName.motorcycle) {
        object.add(ambientLight);
      }
    });

    const spotLight = new SpotLight(SECTION_DATA.intro.spotLight.color, 150);
    spotLight.position.set(
      SECTION_DATA.intro.spotLight.position.x,
      SECTION_DATA.intro.spotLight.position.y,
      SECTION_DATA.intro.spotLight.position.z
    );
    spotLight.angle = Math.PI / 16;
    spotLight.penumbra = 0;
    spotLight.castShadow = true;
    spotLight.name = SECTION_DATA.intro.objectName.spotLight;

    this.addObjectsToScene(
      true,
      directionalLightA,
      directionalLightB,
      directionalLightC,
      directionalLightD
    );
  }

  // NOTE: Change POV to intro section.
  private changePOVToIntroSection() {
    const moveCameraToIntroSection = () => {
      const sectionTypeInfo = this.sectionController.getSectionTypeInfo();

      this.moveCameraPOVToNext();

      if (sectionTypeInfo.active === 'intro') {
        this.frameManager.removeFrameUpdateAction(moveCameraToIntroSection.name);

        return;
      }
    };

    this.frameManager.addFrameUpdateAction({
      name: moveCameraToIntroSection.name,
      action: moveCameraToIntroSection.bind(this),
    });
    this.frameManager.activate();
  }

  resize() {
    this.onResize();

    this.render();
  }

  render() {
    this.onRender();
  }

  scroll(wheelEvent: WheelEvent) {
    const activeSectionType = this.sectionController.getSectionTypeInfo().active;

    console.info(activeSectionType);

    if (activeSectionType === 'loading') {
      this.logWorker.warn('Scroll event is not available in loading section.');

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
    this.frameManager.activate();
  }

  private showWireframe() {
    if (this.isWireframeMode) return;

    this.isWireframeMode = true;

    this.activeScene.traverse(object => {
      if (object.name === SECTION_DATA.loading.objectName.motorcycle) {
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
                grandChild.material.wireframe = this.isWireframeMode;
              }
            })
          );
      }
    });
  }

  private unshowWireframe() {
    if (!this.isWireframeMode) return;

    this.isWireframeMode = false;

    this.activeScene.traverse(object => {
      if (object.name === SECTION_DATA.loading.objectName.motorcycle) {
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
                grandChild.material.wireframe = this.isWireframeMode;
              }
            })
          );
      }
    });
  }

  private showBattery() {
    const batteryModel = this.activeScene.getObjectByName('batteryModel');

    this.removeObjectsFromScene(false, SECTION_DATA.loading.objectName.motorcycle);

    if (batteryModel) {
      const oneBatteryModel = batteryModel.children[0];
      oneBatteryModel.rotateX((Math.PI / 180) * 90);
      oneBatteryModel.rotateZ(-Math.PI / 2);

      oneBatteryModel.position.add(new Vector3(0, -0.05, 0));

      this.addObjectsToScene(true, oneBatteryModel);
    }
  }

  private showMCU() {
    const mcuModel = this.activeScene.getObjectByName('mcuModel');

    this.removeObjectsFromScene(false, SECTION_DATA.loading.objectName.motorcycle);

    if (mcuModel) {
      mcuModel.position.add(new Vector3(-0.8, -1.25, 0));
      this.addObjectsToScene(true, mcuModel);
    }
  }

  async activate() {
    this.onActivate();

    // NOTE: Load Model
    await this.loadMotorcycle();

    // TODO: Remove this comment.
    // this.activeScene.background = new Color(0xffffff);

    // NOTE: Loading Section
    await this.hideTitle();

    this.showMotorcycle();

    await this.closerMotorcycle();

    this.startTheEngine();

    setTimeout(() => {
      this.removeDirectionalLight();
      this.turnOnTheLight();
      this.changePOVToIntroSection();
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
