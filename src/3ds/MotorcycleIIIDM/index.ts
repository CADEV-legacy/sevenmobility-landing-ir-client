import { DirectionalLight, Mesh, MeshStandardMaterial, PlaneGeometry } from 'three';
import { GLTF } from 'three-stdlib';

import { GroundMirror, Smoke } from './components';
import { SECTION_DATA, SectionType } from './resources';

import { IIIDM, IIIDMCore } from '@/IIIDM';
import { OnLoadCompleteAction, OnLoadProgressAction } from '@/IIIDM/workers';

export class MotorcycleIIIDM extends IIIDM {
  private sectionType: SectionType;

  private smoke: Smoke;
  private groundMirror: GroundMirror;
  private motorcycle: GLTF | null = null;

  private motorcycleVelocity: number;

  constructor(core: IIIDMCore) {
    super(core);

    this.sectionType = 'loading';

    this.smoke = new Smoke(
      SECTION_DATA.loading.objectName.smoke,
      SECTION_DATA.loading.smoke.opacity.initialValue,
      SECTION_DATA.loading.smoke.opacity.additionalValue,
      SECTION_DATA.loading.smoke.rotation.additionalValue
    );

    this.groundMirror = new GroundMirror(
      this.canvas.clientWidth,
      this.canvas.clientHeight,
      SECTION_DATA.loading.groundMirror.color,
      SECTION_DATA.loading.groundMirror.name
    );

    this.motorcycleVelocity = SECTION_DATA.loading.motorcycle.initialVelocity;

    this.frameManager.initialize();
    this.controlManager.initialize();
    this.effectManager.initialize(
      SECTION_DATA.loading.bloomEffect.strength,
      SECTION_DATA.loading.bloomEffect.radius,
      SECTION_DATA.loading.bloomEffect.threshold,
      'selective',
      SECTION_DATA.loading.bloomEffect.layerDepth
    );
  }

  // NOTE: Below functions are must set on page before activate.
  set onLoadProgressAction(action: OnLoadProgressAction) {
    this.resourceWorker.onLoadProgressAction = action;
  }

  set onLoadCompleteAction(action: OnLoadCompleteAction) {
    this.resourceWorker.onLoadCompleteAction = action;
  }

  // set onLoadingSectionStart(action: OnLoadingSectionStart) {
  //   this.loadingSectionStartAction = action;
  // }

  private updateControl() {
    this.controlManager.orbitControl.update();
  }

  // private changeHeadLightIntensity(intensity: number) {
  //   this.motorcycleModel?.scene.traverse(object => {
  //     if (
  //       object instanceof Mesh &&
  //       object.isMesh &&
  //       object.name === LOADING_SECTION_DATA.loadMotorcycle.motorcycle.headLight.key &&
  //       object.material instanceof MeshStandardMaterial &&
  //       object.material.isMaterial &&
  //       object.material.name ===
  //         `${LOADING_SECTION_DATA.loadMotorcycle.motorcycle.headLight.key}_material`
  //     ) {
  //       object.material.emissive =
  //         LOADING_SECTION_DATA.loadMotorcycle.motorcycle.headLight.emissiveColor;
  //       object.material.emissiveIntensity = intensity;
  //     }
  //   });
  // }

  private async loading() {
    try {
      this.motorcycle = await this.resourceWorker.loadResource(
        SECTION_DATA.loading.motorcycle.path
      );

      this.motorcycle.scene.traverse(object => {
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
      this.motorcycle.scene.position.add(SECTION_DATA.loading.motorcycle.position);
      this.motorcycle.scene.name = SECTION_DATA.loading.objectName.motorcycle;

      const directionalLight = new DirectionalLight(
        SECTION_DATA.loading.directionalLight.color,
        SECTION_DATA.loading.directionalLight.intensity
      );

      directionalLight.position.add(SECTION_DATA.loading.directionalLight.position);
      directionalLight.target.position.add(SECTION_DATA.loading.directionalLight.targetPosition);
      directionalLight.name = SECTION_DATA.loading.objectName.directionalLight;

      this.activeCamera.position.add(SECTION_DATA.loading.camera.position);
      this.activeCamera.lookAt(SECTION_DATA.loading.camera.lookAt);

      this.activeCamera.updateProjectionMatrix();

      this.addObjectsToScene(
        true,
        this.motorcycle.scene,
        directionalLight,
        // this.smoke.smokeMesh
        this.groundMirror.mirror
      );
    } catch (error) {
      throw this.logWorker.error('Failed to load model.', error);
    }
  }

  private startTheEngine() {
    this.motorcycle?.scene.traverse(object => {
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

    this.effectManager.activate();
    this.effectManager.render();
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

    if (this.effectManager.isActive) this.effectManager.resize();

    this.render();
  }

  render() {
    if (this.effectManager.isActive) this.effectManager.render();
    else this.onRender();
  }

  async activate() {
    this.onActivate();

    await this.loading();

    // this.startTheEngine();

    // this.effectManager.activate();

    // this.controlManager.orbitControl.target = SECTION_DATA.loading.camera.lookAt;
    // this.controlManager.orbitControl.update();
    // this.controlManager.activate();

    // this.frameManager.addFrameUpdateAction({
    //   name: 'updateControl',
    //   action: this.updateControl.bind(this),
    // });
    // this.frameManager.activate();
  }

  deactivate() {
    this.onDeactivate();
  }

  dispose() {
    this.onDispose();
  }
}
