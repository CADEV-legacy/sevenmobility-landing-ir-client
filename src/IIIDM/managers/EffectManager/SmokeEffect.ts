import { Material, Mesh, MeshLambertMaterial, PlaneGeometry, TextureLoader } from 'three';

const SMOKE_OPACITY_ADD = 0.01 as const;
const SMOKE_ROTATION_ADD = 0.001 as const;

export class SmokeEffect {
  private _smokeMesh: Mesh;

  constructor() {
    const smokeTexture = new TextureLoader().load('/3ds/textures/smoke.png');
    const smokeGeometry = new PlaneGeometry(100, 100);
    const smokeMaterial = new MeshLambertMaterial({
      map: smokeTexture,
      opacity: 0,
      transparent: true,
      emissiveIntensity: 0,
    });

    const smokeMesh = new Mesh(smokeGeometry, smokeMaterial);
    smokeMesh.scale.set(0.06, 0.06, 0.06);
    smokeMesh.position.set(0, 1, 0);
    smokeMesh.rotation.y = -Math.PI / 2;
    smokeMesh.rotation.x = Math.PI * 1.5;
    smokeMesh.name = 'smoke';

    this._smokeMesh = smokeMesh;
  }

  get smokeMesh() {
    return this._smokeMesh;
  }

  frameAction() {
    if (this._smokeMesh.material instanceof Material && this._smokeMesh.material.opacity < 1)
      this._smokeMesh.material.opacity += SMOKE_OPACITY_ADD;
    this._smokeMesh.rotation.x += SMOKE_ROTATION_ADD;
  }
}
