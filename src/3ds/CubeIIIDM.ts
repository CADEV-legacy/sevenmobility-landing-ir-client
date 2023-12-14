import {
  AmbientLight,
  Clock,
  DirectionalLight,
  IcosahedronGeometry,
  Mesh,
  MeshBasicMaterial,
  MeshLambertMaterial,
} from 'three';
import { OrbitControls } from 'three/examples/jsm/Addons.js';

import { IIIDM, IIIDMCore } from '@/IIIDM';

const CUBE_COLOR = '#007B0B' as const;
const SKELETON_COLOR = '#FF33FF' as const;
const LIGHT_COLOR = '#FFFFFF' as const;

export class CubeIIIDM extends IIIDM {
  clock: Clock;

  constructor(core?: IIIDMCore, isDevMode?: boolean) {
    super(core, isDevMode);

    this.clock = new Clock();
  }

  async initialize() {
    const cubeGeometry = new IcosahedronGeometry(1);
    const cubeMaterial = new MeshLambertMaterial({
      color: CUBE_COLOR,
    });

    const cubeMesh = new Mesh(cubeGeometry, cubeMaterial);

    const skeletonGeometry = new IcosahedronGeometry(2);
    const skeletonMaterial = new MeshBasicMaterial({
      wireframe: true,
      color: SKELETON_COLOR,
      opacity: 0.5,
    });

    const skeletonMesh = new Mesh(skeletonGeometry, skeletonMaterial);

    const directionalLight = new DirectionalLight(LIGHT_COLOR, 1);
    const ambientLight = new AmbientLight(LIGHT_COLOR, 0.5);

    this.sceneObject3dMaps = [
      ...this.sceneObject3dMaps,
      { key: 'directional_light', type: 'light', object: directionalLight },
      { key: 'ambient_light', type: 'light', object: ambientLight },
      { key: 'cube', type: 'mesh', object: cubeMesh },
      { key: 'skeleton', type: 'mesh', object: skeletonMesh },
    ];

    new OrbitControls(this.camera, this.canvas);

    this.camera.aspect = this.canvas.clientWidth / this.canvas.clientHeight;
    this.camera.position.set(0, 0, 5);

    this.scene.add(...this.sceneObject3dMaps.map(sceneObject3dMap => sceneObject3dMap.object));

    this.renderer.render(this.scene, this.camera);
  }

  update(): void {
    const ellapsedTime = this.clock.getElapsedTime();

    this.sceneObject3dMaps.forEach(sceneObject3dMap => {
      if (sceneObject3dMap.key === 'cube') {
        sceneObject3dMap.object.rotation.x = ellapsedTime;
        sceneObject3dMap.object.rotation.y = ellapsedTime;
      } else if (sceneObject3dMap.key === 'skeleton') {
        sceneObject3dMap.object.rotation.x = -ellapsedTime * 1.5;
        sceneObject3dMap.object.rotation.y = -ellapsedTime * 1.5;
      }
    });

    this.renderer.render(this.scene, this.camera);
  }
}
