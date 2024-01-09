import {
  Color,
  Layers,
  Material,
  Mesh,
  MeshBasicMaterial,
  Object3D,
  Object3DEventMap,
  ShaderMaterial,
  Vector2,
} from 'three';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';

import { IIIDM } from '@/IIIDM';
import { IIIDMManager } from '@/IIIDM/managers';

type BloomEffectType = 'all' | 'selective';

type SelectedMaterial = Record<string, Material>;

const DEFAULT_LAYDER_DEPTH = 1;

const BLOOM_EFFECT_SHADER = {
  vertex: `
    varying vec2 vUv;

    void main() {

      vUv = uv;

      gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );

    }
  `,
  fragment: `
    uniform sampler2D baseTexture;
    uniform sampler2D bloomTexture;

    varying vec2 vUv;

    void main() {

      gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

    }
  `,
} as const;

/** TODO: Make manager class of all effects, not only bloomEffect. */
export class EffectManager extends IIIDMManager {
  private renderScene: RenderPass;
  private mixPass: ShaderPass | null = null;
  private outputPass: OutputPass | null = null;
  private bloomPass: UnrealBloomPass;
  private bloomLayer: Layers = new Layers();
  private layerDepth: number = DEFAULT_LAYDER_DEPTH;
  private darkMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: new Color(0x000000) });
  private _bloomEffectComposer: EffectComposer;
  private _finalEffectComposer: EffectComposer | null = null;
  private bloomEffectType: BloomEffectType = 'all';
  private selectedMaterial: SelectedMaterial = {};

  constructor(maker: IIIDM) {
    super(maker);

    this.bloomEffectType = 'all';
    this.layerDepth = DEFAULT_LAYDER_DEPTH;
    this.bloomLayer.set(this.layerDepth);

    this._bloomEffectComposer = new EffectComposer(this.maker.renderer);

    if (!this.maker.activeScene || !this.maker.activeCamera)
      throw this.logWorker.error('Not found scene or camera.');

    this.renderScene = new RenderPass(this.maker.activeScene, this.maker.activeCamera);
    this.bloomPass = new UnrealBloomPass(
      new Vector2(this.maker.canvas.width, this.maker.canvas.height),
      1,
      0.5,
      0
    );

    // this._bloomEffectComposer.setPixelRatio(window.devicePixelRatio);
    // this._bloomEffectComposer.setSize(
    //   this.maker.canvas.clientWidth,
    //   this.maker.canvas.clientHeight
    // );
    this._bloomEffectComposer.addPass(this.renderScene);
    this._bloomEffectComposer.addPass(this.bloomPass);
    this._bloomEffectComposer.renderToScreen = true;
  }

  get bloomEffectComposer() {
    return this._bloomEffectComposer;
  }

  get finalEffectComposer() {
    return this._finalEffectComposer;
  }

  private changeMaterialToDark(object: Object3D<Object3DEventMap>) {
    if (!(object instanceof Mesh) || !object.isMesh) return;

    if (!this.bloomLayer.test(object.layers)) {
      this.selectedMaterial[object.uuid] = object.material;

      object.material = this.darkMaterial;
    }
  }

  private restoreMaterial(object: Object3D<Object3DEventMap>) {
    if (!(object instanceof Mesh) || !object.isMesh) return;

    if (this.selectedMaterial[object.uuid]) {
      object.material = this.selectedMaterial[object.uuid];

      delete this.selectedMaterial[object.uuid];
    }
  }

  initialize(
    strength: number,
    radius: number,
    threshold: number,
    bloomEffectType?: BloomEffectType,
    layerDepth?: number
  ) {
    this.onInitialize();

    if (bloomEffectType) this.bloomEffectType = bloomEffectType;
    if (layerDepth) {
      this.layerDepth = layerDepth;
    }

    this.bloomLayer.set(this.layerDepth);
    this.bloomPass.strength = strength;
    this.bloomPass.radius = radius;
    this.bloomPass.threshold = threshold;

    if (this.bloomEffectType === 'selective') {
      this._bloomEffectComposer.renderToScreen = false;
      this._finalEffectComposer = new EffectComposer(this.maker.renderer);
      // this._finalEffectComposer.setPixelRatio(window.devicePixelRatio);
      // this._finalEffectComposer.setSize(
      //   this.maker.canvas.width * devicePixelRatio,
      //   this.maker.canvas.height * devicePixelRatio
      // );

      this.mixPass = new ShaderPass(
        new ShaderMaterial({
          uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: this._bloomEffectComposer.renderTarget2.texture },
          },
          vertexShader: BLOOM_EFFECT_SHADER.vertex,
          fragmentShader: BLOOM_EFFECT_SHADER.fragment,
          defines: {},
        }),
        'baseTexture'
      );
      this.mixPass.needsSwap = true;

      this.outputPass = new OutputPass();

      this._finalEffectComposer.addPass(this.renderScene);
      this._finalEffectComposer.addPass(this.mixPass);
      this._finalEffectComposer.addPass(this.outputPass);
    }
  }

  activate() {
    this.onActivate();
  }

  deactivate() {
    this.onDeactivate();
  }

  clear() {
    this.onClear();

    if (this._bloomEffectComposer) {
      this._bloomEffectComposer.dispose();
    }

    if (this._finalEffectComposer) {
      this._finalEffectComposer.dispose();
      this._finalEffectComposer = null;
    }
  }

  resize() {
    this._bloomEffectComposer.setSize(
      this.maker.canvas.clientWidth,
      this.maker.canvas.clientHeight
    );

    if (this._finalEffectComposer) {
      this._finalEffectComposer.setSize(
        this.maker.canvas.clientWidth,
        this.maker.canvas.clientHeight
      );
    }
  }

  render() {
    if (!this.maker.activeScene || !this.maker.activeCamera)
      throw this.logWorker.error('Not found scene or camera.');

    if (!this._bloomEffectComposer) throw this.logWorker.error('Not found bloom effect composer.');

    if (this.bloomEffectType === 'all') {
      this._bloomEffectComposer.render();
    } else {
      if (!this._finalEffectComposer)
        throw this.logWorker.error('Not found final effect composer.');

      this.maker.activeScene.traverse(this.changeMaterialToDark.bind(this));

      this._bloomEffectComposer.render();

      this.maker.activeScene.traverse(this.restoreMaterial.bind(this));

      this._finalEffectComposer.render();
    }
  }
}
