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

import { IIIDMCore } from '@/IIIDM/IIIDMCore';
import { IIIDMManager } from '@/IIIDM/IIIDMManager';

type BloomEffectType = 'all' | 'selective';

type SelectedMaterial = Record<string, Material>;

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

export class EffectManager extends IIIDMManager {
  private renderScene: RenderPass | null = null;
  private mixPass: ShaderPass | null = null;
  private outputPass: OutputPass | null = null;
  private bloomPass: UnrealBloomPass | null = null;
  private bloomLayer: Layers = new Layers();
  private darkMaterial: MeshBasicMaterial = new MeshBasicMaterial({ color: new Color(0x000000) });
  private _bloomEffectComposer: EffectComposer | null = null;
  private _finalEffectComposer: EffectComposer | null = null;
  private _bloomEffectType: BloomEffectType = 'all';
  private _selectedMaterial: SelectedMaterial = {};

  constructor(core: IIIDMCore) {
    super(core);
  }

  get bloomEffectComposer() {
    return this._bloomEffectComposer;
  }

  set bloomEffectComposer(value) {
    this._bloomEffectComposer = value;
  }

  get finalEffectComposer() {
    return this._finalEffectComposer;
  }

  set finalEffectComposer(value) {
    this._finalEffectComposer = value;
  }

  get bloomEffectType() {
    return this._bloomEffectType;
  }

  private changeMaterialToDark(object: Object3D<Object3DEventMap>) {
    if (!(object instanceof Mesh) || !object.isMesh) return;

    if (this.bloomLayer.test(object.layers) === false) {
      this._selectedMaterial[object.uuid] = object.material;

      object.material = this.darkMaterial;
    }
  }

  private restoreMaterial(object: Object3D<Object3DEventMap>) {
    if (!(object instanceof Mesh) || !object.isMesh) return;

    if (this._selectedMaterial[object.uuid]) {
      object.material = this._selectedMaterial[object.uuid];

      delete this._selectedMaterial[object.uuid];
    }
  }

  activate(
    strength: number,
    radius: number,
    threshold: number,
    bloomEffectType?: BloomEffectType,
    layerDepth?: number
  ) {
    this.onActivate();

    this._bloomEffectType = bloomEffectType ?? 'all';
    this.bloomLayer.set(layerDepth ?? 1000);

    this.bloomEffectComposer = new EffectComposer(this.core.renderer);

    if (!this.core.activeScene || !this.core.activeCamera)
      throw this.logWorker.error('Not found scene or camera.');

    this.renderScene = new RenderPass(this.core.activeScene, this.core.activeCamera);
    this.bloomPass = new UnrealBloomPass(
      new Vector2(this.core.canvas.width, this.core.canvas.height),
      strength,
      radius,
      threshold
    );

    this.bloomEffectComposer.addPass(this.renderScene);
    this.bloomEffectComposer.addPass(this.bloomPass);
    this.bloomEffectComposer.renderToScreen = false;

    if (this._bloomEffectType === 'selective') {
      this.finalEffectComposer = new EffectComposer(this.core.renderer);

      this.mixPass = new ShaderPass(
        new ShaderMaterial({
          uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: this.bloomEffectComposer.renderTarget2.texture },
          },
          vertexShader: BLOOM_EFFECT_SHADER.vertex,
          fragmentShader: BLOOM_EFFECT_SHADER.fragment,
          defines: {},
        }),
        'baseTexture'
      );
      this.mixPass.needsSwap = true;

      this.outputPass = new OutputPass();

      this.finalEffectComposer.addPass(this.renderScene);
      this.finalEffectComposer.addPass(this.mixPass);
      this.finalEffectComposer.addPass(this.outputPass);
    }
  }

  deactivate() {
    this.onDeactivate();
  }

  initialize() {
    this.onInitialize();

    if (this.bloomEffectComposer) {
      this.bloomEffectComposer.dispose();
      this.bloomEffectComposer = null;
    }

    if (this.finalEffectComposer) {
      this.finalEffectComposer.dispose();
      this.finalEffectComposer = null;
    }
  }

  resize() {
    if (!this.bloomEffectComposer) throw this.logWorker.error('Not found bloom effect composer.');

    this.bloomEffectComposer.setSize(this.core.canvas.width, this.core.canvas.height);

    if (this.finalEffectComposer) {
      this.finalEffectComposer.setSize(this.core.canvas.width, this.core.canvas.height);
    }
  }

  render() {
    if (!this.core.activeScene || !this.core.activeCamera)
      throw this.logWorker.error('Not found scene or camera.');

    if (!this.bloomEffectComposer) throw this.logWorker.error('Not found bloom effect composer.');

    if (this.bloomEffectType === 'all') {
      this.bloomEffectComposer.render();
    } else {
      if (!this.finalEffectComposer) throw this.logWorker.error('Not found final effect composer.');

      this.core.activeScene.traverse(this.changeMaterialToDark.bind(this));

      this.bloomEffectComposer.render();

      this.core.activeScene.traverse(this.restoreMaterial.bind(this));

      this.finalEffectComposer.render();
    }
  }
}
