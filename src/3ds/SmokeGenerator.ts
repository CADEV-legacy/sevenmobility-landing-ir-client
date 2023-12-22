import { Mesh, MeshLambertMaterial, PlaneGeometry, TextureLoader } from 'three';

export class SmokeGenerator {
  private _smokeMeshe: Mesh;

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
    smokeMesh.scale.set(0.025, 0.025, 0.025);
    smokeMesh.position.set(0, 0.5, 0);
    smokeMesh.rotation.y = -Math.PI / 2;
    smokeMesh.rotation.x = Math.PI * 1.5;
    smokeMesh.name = 'smoke';

    this._smokeMeshe = smokeMesh;
  }

  get smokeMeshe() {
    return this._smokeMeshe;
  }
}
