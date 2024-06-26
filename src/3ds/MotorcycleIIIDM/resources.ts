import { Color, Vector3 } from 'three';

const LOADING_SECTION_DATA = {
  objectName: {
    directionalLight: 'directionalLight',
    smoke: 'smoke',
    groundMirror: 'groundMirror',
    motorcycleModel: 'motorcycleModel',
    batteryModel: 'batteryModel',
    mcuModel: 'mcuModel',
    batteryModelSolo: 'batteryModelSolo',
    mcuModelSolo: 'mcuModelSolo',
  },
  background: {
    colorCode: {
      startCode: 0,
      endCode: 22,
    },
  },
  camera: {
    position: new Vector3(-4, 1.5, 0),
    lookAt: new Vector3(0, 1, 0),
  },
  directionalLight: {
    color: new Color(0xffffff),
    intensity: 0.2,
    maxIntensity: 2,
    position: new Vector3(-3, 3, 3),
    targetPosition: new Vector3(-1, 1, 0),
  },
  motorcycle: {
    paths: [
      '/3ds/models/motorcycle.glb',
      '/3ds/models/battery.glb',
      '/3ds/models/mcu.glb',
      '/3ds/models/battery.glb',
      '/3ds/models/mcu.glb',
    ],
    position: new Vector3(1, 0, 0),
    headLight: {
      key: 'light',
      emissiveColor: new Color(0xffffff),
      emissiveIntensity: 1.5,
      changedEmissiveIntensity: 0.8,
    },
    velocity: {
      initialValue: 0.025,
      acceleration: 0.0003125,
    },
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
    colorCode: {
      startCode: 52,
      endCode: 99,
    },
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

const SPEC_SECTION_DATA = {
  objectName: {
    spotLight: 'spotLight',
  },
  camera: {
    position: new Vector3(-1.5, 1, -5),
    lookAt: new Vector3(-1.5, 1, 0),
    changeCount: 100,
    targetChangeCount: 100,
  },
  spotLight: {
    color: new Color(0xffffff),
    position: new Vector3(0, 5, 0),
  },
};

const BATTERY_SECTION_DATA = {
  objectName: {},
  camera: {
    position: new Vector3(-0.6, 1, -2),
    lookAt: new Vector3(0.5, 0.2, 0),
    changeCount: 200,
    targetChangeCount: 100,
  },
};

const BMS_SECTION_DATA = {
  objectName: {},
  camera: {
    position: new Vector3(-2, 0.8, -0.8),
    lookAt: new Vector3(0, 0.4, -0.4),
    changeCount: 200,
    targetChangeCount: 100,
  },
};

const MCU_SECTION_DATA = {
  objectName: {},
  camera: {
    position: new Vector3(-1, 0.4, -0.8),
    lookAt: new Vector3(0, 0, 0),
    changeCount: 200,
    targetChangeCount: 100,
  },
};

const ELECTRIC_MOTOR_SECTION_DATA = {
  objectName: {},
  camera: {
    position: new Vector3(0.8, 0.25, -2.25),
    lookAt: new Vector3(0.5, 0.5, 0),
    changeCount: 200,
    targetChangeCount: 100,
  },
};

const REGENERATIVE_BRAKING_SECTION_DATA = {
  objectName: {},
  camera: {
    position: new Vector3(1.5, 1, -3),
    lookAt: new Vector3(1.5, 0.6, 0),
    changeCount: 200,
    targetChangeCount: 100,
  },
};

const USER_REVIEW_SECTION_DATA = {
  objectName: {},
  camera: {
    position: new Vector3(3, 1.5, -3),
    lookAt: new Vector3(0, 1, 0),
    changeCount: 200,
    targetChangeCount: 100,
  },
};

const DETAIL_SECTION_DATA = {
  objectName: {},
  camera: {
    position: new Vector3(-4, 2.5, 4),
    lookAt: new Vector3(0, -0.5, 0),
    changeCount: 200,
    targetChangeCount: 100,
  },
};

export const SECTION_DATA = {
  loading: LOADING_SECTION_DATA,
  spec: SPEC_SECTION_DATA,
  battery: BATTERY_SECTION_DATA,
  bms: BMS_SECTION_DATA,
  mcu: MCU_SECTION_DATA,
  electricMotor: ELECTRIC_MOTOR_SECTION_DATA,
  regenerativeBraking: REGENERATIVE_BRAKING_SECTION_DATA,
  userReview: USER_REVIEW_SECTION_DATA,
  detail: DETAIL_SECTION_DATA,
} as const;
