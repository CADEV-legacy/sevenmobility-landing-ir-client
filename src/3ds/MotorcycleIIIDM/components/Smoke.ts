import { Material, Mesh, MeshLambertMaterial, PlaneGeometry, TextureLoader } from 'three';

export class Smoke {
  private _smokeMesh: Mesh;
  private smokeOpacityAdditionalValue: number;
  private smokeRotationAdditionalValue: number;

  constructor(
    smokeName: string,
    smokeOpacityInitialValue: number,
    smokeOpacityAdditionalValue: number,
    smokeRotationAdditionalValue: number
  ) {
    const smokeTexture = new TextureLoader().load('/3ds/textures/smoke.png');
    const smokeGeometry = new PlaneGeometry(100, 100);
    const smokeMaterial = new MeshLambertMaterial({
      map: smokeTexture,
      opacity: smokeOpacityInitialValue,
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
    smokeMesh.name = smokeName;
    this.smokeOpacityAdditionalValue = smokeOpacityAdditionalValue;
    this.smokeRotationAdditionalValue = smokeRotationAdditionalValue;
  }

  get smokeMesh() {
    return this._smokeMesh;
  }

  frameUpdateAction() {
    if (this._smokeMesh.material instanceof Material && this._smokeMesh.material.opacity < 1)
      this._smokeMesh.material.opacity += this.smokeOpacityAdditionalValue;
    this._smokeMesh.rotation.x += this.smokeRotationAdditionalValue;
  }
}
