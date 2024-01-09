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

export class MotorcycleIIIDM extends IIIDM {
  private sectionType: SectionType;

  private motorcycleVelocity = SECTION_DATA.loading.motorcycle.velocity.initialValue;
  private titleOpacityScore = 1;
  private titleOpacityScoreSub = SECTION_DATA.loading.title.opacityScore.sub.initialValue;
  private _onHideTitleAction: onHideTitleAction | null = null;

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
    this.activeCamera.lookAt(SECTION_DATA.loading.camera.lookAt);

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

  // TODO: Remove this function.
  private updateControl() {
    this.controlManager.orbitControl.update();

    this.activeCamera.updateProjectionMatrix();
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
      let currentMotorcyclePosition: number | null = null;
      let currentDirectionalLightIntensity: number | null = null;

      const runMotorcycle = () => {
        if (this.motorcycleVelocity >= SECTION_DATA.loading.motorcycle.velocity.minimumValue) {
          this.motorcycleVelocity -= SECTION_DATA.loading.motorcycle.velocity.acceleration;
        } else {
          this.motorcycleVelocity -= SECTION_DATA.loading.motorcycle.velocity.minimumAcceleration;
        }

        if (
          !currentDirectionalLightIntensity ||
          currentDirectionalLightIntensity <= SECTION_DATA.loading.directionalLight.maxIntensity
        ) {
          this.activeScene.traverse(object => {
            if (
              object instanceof DirectionalLight &&
              object.name === SECTION_DATA.loading.objectName.directionalLight
            ) {
              object.intensity += 0.08;

              currentDirectionalLightIntensity = object.intensity;
            }
          });
        }

        if (
          currentMotorcyclePosition &&
          currentMotorcyclePosition <= SECTION_DATA.loading.motorcycle.closedPosition
        ) {
          this.frameManager.removeFrameUpdateAction(runMotorcycle.name);
          return resolve();
        }

        this.activeScene.traverse(object => {
          if (object.name === SECTION_DATA.loading.objectName.motorcycle) {
            object.position.add(new Vector3(-this.motorcycleVelocity, 0, 0));

            currentMotorcyclePosition = object.position.x;
          }
        });
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

  // private closerCamera() {
  //   if (this.motorcycleVelocity >= 0) {
  //     this.activeCamera.position.add(new Vector3(this.motorcycleVelocity, 0, 0));
  //     this.motorcycleVelocity -= LOADING_SECTION_DATA.closerCamera.motorcycle.acceleration;
  //     this.activeCamera.updateProjectionMatrix();
  //   } else {
  //     this.startTheEngine();
  //     this.activeFrameManager.removeFrameUpdateAction('closerCamera');
  //   }
  // }

  // private openSmokeEffect() {
  //   this.smokeEffect.frameAction();
  // }

  // private titleHandleFrameAction() {
  //   if (this.loadingSectionTitleOpacityScore <= 0.2) {
  //     this.activeFrameManager.changeFrameUpdateAction([
  //       { key: 'closerCamera', action: this.closerCamera.bind(this) },
  //       { key: 'openSmokeEffect', action: this.openSmokeEffect.bind(this) },
  //     ]);

  //     const dirLight = this.activeScene.getObjectByName(
  //       OBJECT_3D_NAME.loadingSectionDirectionalLight
  //     ) as DirectionalLight;

  //     if (dirLight.intensity <= 2) {
  //       dirLight.intensity += 0.1;
  //     }
  //   }

  //   if (this.loadingSectionTitleOpacityScore <= 0) {
  //     this.activeFrameManager.removeFrameUpdateAction('titleHandleFrameAction');
  //   }

  //   this.loadingSectionStartAction?.((this.loadingSectionTitleOpacityScore -= 0.018));
  // }

  // private startTheEngine() {
  //   setTimeout(() => {
  //     this.changeHeadLightIntensity(
  //       LOADING_SECTION_DATA.startTheEngine.motorcycle.headLight.emissiveIntensity
  //     );

  //     this.motorcycleModel?.scene.traverse(object => {
  //       if (
  //         object instanceof Mesh &&
  //         object.isMesh &&
  //         object.name === LOADING_SECTION_DATA.loadMotorcycle.motorcycle.headLight.key &&
  //         object.material instanceof MeshStandardMaterial &&
  //         object.material.isMaterial
  //       ) {
  //         console.info('Layer on');
  //         console.info(object);
  //         object.layers.enable(BLOOM_LAYER_DEPTH);
  //       }
  //     });

  //     this.render();

  //     // this.removeObject3DMap(OBJECT_3D_MAP_KEY.smokeMesh);
  //     // this.activeFrameManager.removeFrameUpdateAction('openSmokeEffect');
  //     // this.activeFrameManager.changeFrameUpdateAction({
  //     //   key: 'moveCameraToSide',
  //     //   action: this.moveCameraToSide.bind(this),
  //     // });
  //     const premGenerator = new PMREMGenerator(this.renderer);
  //     premGenerator.fromScene(this.activeScene, 0.04);
  //   }, 500);
  // }

  // private moveCameraToSide() {
  //   if (!this.loadingCameraRotationCircleRadius || !this.loadingCameraRotationCicleYPosition) {
  //     this.loadingCameraRotationCircleRadius = Math.sqrt(
  //       Math.pow(this.activeCamera.position.x, 2) + Math.pow(this.activeCamera.position.z, 2)
  //     );
  //     this.loadingCameraRotationCicleYPosition = this.activeCamera.position.y;
  //   }

  //   const newZPosition = (this.activeCamera.position.z += 0.01);
  //   const newXPosition = Math.sqrt(
  //     Math.pow(this.loadingCameraRotationCircleRadius, 2) - Math.pow(newZPosition, 2)
  //   );

  //   this.activeCamera.position.set(
  //     -newXPosition,
  //     this.loadingCameraRotationCicleYPosition,
  //     newZPosition
  //   );
  //   this.activeCamera.updateProjectionMatrix();
  // }

  resize() {
    this.onResize();

    this.render();
  }

  render() {
    this.onRender();
  }

  async activate() {
    this.onActivate();

    await this.loadMotorcycle();

    await this.hideTitle();

    this.showMotorcycle();

    await this.closerMotorcycle();

    this.startTheEngine();

    // TODO: Remove this comment.
    this.controlManager.orbitControl.target = SECTION_DATA.loading.camera.lookAt;
    this.controlManager.orbitControl.update();
    this.controlManager.activate();

    this.frameManager.addFrameUpdateAction({
      name: this.updateControl.name,
      action: this.updateControl.bind(this),
    });
    // this.frameManager.activate();
  }

  deactivate() {
    this.onDeactivate();
  }

  dispose() {
    this.onDispose();
  }
}
