import { Color, Vector3 } from 'three';

const LOADING_SECTION_DATA = {
  objectName: {
    directionalLight: 'directionalLight',
    smoke: 'smoke',
    motorcycle: 'motorcycle',
    groundMirror: 'groundMirror',
  },
  background: {
    color: new Color(0x000000),
  },
  camera: {
    position: new Vector3(-4, 1.5, 0),
    lookAt: new Vector3(0, 1, 0),
  },
  directionalLight: {
    color: new Color(0xffffff),
    intensity: 0.1,
    maxIntensity: 2,
    position: new Vector3(-1, 1, 0),
    targetPosition: new Vector3(0, 1, 0),
  },
  motorcycle: {
    path: '/3ds/models/motorcycle.glb',
    position: new Vector3(20, 0, 0),
    headLight: {
      key: 'light',
      emissiveColor: new Color(0xffffff),
      emissiveIntensity: 1.5,
      changedEmissiveIntensity: 0.8,
    },
    velocity: {
      initialValue: 0.6,
      minimumValue: 0.05,
      acceleration: 0.01,
      minimumAcceleration: 0.0001,
    },
    closedPosition: 0,
  },
  bloomEffect: {
    layerDepth: 1,
    strength: 1.5,
    radius: 1,
    threshold: 0.1,
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
  },
  smoke: {
    opacity: {
      initialValue: 0,
      additionalValue: 0.01,
    },
    rotation: {
      additionalValue: 0.001,
    },
  },
  groundMirror: {
    color: new Color(0x151515),
    name: 'groundMirror',
  },
  title: {
    opacityScore: {
      sub: {
        initialValue: 0,
        additionalValue: 0.0008,
      },
    },
  },
};

const BATTERY_SECTINO_DATA = {};

const BMS_SECTION_DATA = {};

const MCU_SECTION_DATA = {};

const ELECTRIC_MOTOR_SECTION_DATA = {};

const REGENERATIVE_BRAKING_SECTION_DATA = {};

const USER_REVIEW_SECTION_DATA = {};

const DETAIL_SECTION_DATA = {};

export type SectionType = keyof typeof SECTION_DATA;

export const SECTION_DATA = {
  loading: LOADING_SECTION_DATA,
  battery: BATTERY_SECTINO_DATA,
  bms: BMS_SECTION_DATA,
  mcu: MCU_SECTION_DATA,
  electricMotor: ELECTRIC_MOTOR_SECTION_DATA,
  regenerativeBraking: REGENERATIVE_BRAKING_SECTION_DATA,
  userReview: USER_REVIEW_SECTION_DATA,
  detail: DETAIL_SECTION_DATA,
};
