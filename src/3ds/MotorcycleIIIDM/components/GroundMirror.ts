import { Color, PlaneGeometry } from 'three';
import { Reflector } from 'three-stdlib';

export class GroundMirror {
  private _mirror: Reflector;

  constructor(
    canvasWidth: number,
    canvasHeight: number,
    mirrorColor: string | number | Color,
    mirrorName: string
  ) {
    const groundGeometry = new PlaneGeometry(1000, 1000);
    const groundMirror = new Reflector(groundGeometry, {
      textureWidth: canvasWidth * window.devicePixelRatio,
      textureHeight: canvasHeight * window.devicePixelRatio,
      color: mirrorColor,
    });

    groundMirror.position.set(0, 0, 0);
    groundMirror.rotateX(-Math.PI / 2);
    groundMirror.name = mirrorName;

    this._mirror = groundMirror;
  }

  get mirror() {
    return this._mirror;
  }
}
