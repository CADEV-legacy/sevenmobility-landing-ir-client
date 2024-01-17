import { Vector3 } from 'three';

import { SectionType, SECTION_DATA } from './resources';

const SECTION_TYPES: SectionType[] = [
  'loading',
  'intro',
  'battery',
  'bms',
  'mcu',
  'electricMotor',
  'regenerativeBraking',
  'userReview',
  'detail',
];

type PrevSectinoType = Exclude<SectionType, 'userReview' | 'detail'>;

type NextSectionType = Exclude<SectionType, 'loading' | 'intro'>;

type SectionTypeInfo = {
  prev: PrevSectinoType | undefined;
  active: SectionType;
  next: NextSectionType | undefined;
};

type SectionExecutorInfoMap = {
  [key in SectionType]?: {
    show: () => void;
    unshow: () => void;
  };
};

type SectionCameraInfo = {
  positionAdditionalVector: Vector3;
  lookAtAdditionalVector: Vector3;
};

type SectionCameraInfoMap = {
  [key in SectionType]: key extends 'detail' ? undefined : SectionCameraInfo;
};

export class SectionController {
  private activeSectionTypeIndex = 0;
  private activeSectionType: SectionType = SECTION_TYPES[this.activeSectionTypeIndex];
  private _sectionCameraInfoMap: SectionCameraInfoMap;
  private _sectionExecutorInfoMap: SectionExecutorInfoMap;

  constructor(sectionExecutorInfoMap: SectionExecutorInfoMap) {
    this._sectionCameraInfoMap = {
      loading: {
        positionAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.loading.camera.position,
          SECTION_DATA.intro.camera.position,
          SECTION_DATA.intro.camera.changeCount
        ),
        lookAtAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.loading.camera.lookAt,
          SECTION_DATA.intro.camera.lookAt,
          SECTION_DATA.intro.camera.changeCount
        ),
      },
      intro: {
        positionAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.intro.camera.position,
          SECTION_DATA.battery.camera.position,
          SECTION_DATA.battery.camera.changeCount
        ),
        lookAtAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.intro.camera.lookAt,
          SECTION_DATA.battery.camera.lookAt,
          SECTION_DATA.battery.camera.changeCount
        ),
      },
      battery: {
        positionAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.battery.camera.position,
          SECTION_DATA.bms.camera.position,
          SECTION_DATA.bms.camera.changeCount
        ),
        lookAtAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.battery.camera.lookAt,
          SECTION_DATA.bms.camera.lookAt,
          SECTION_DATA.bms.camera.changeCount
        ),
      },
      bms: {
        positionAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.bms.camera.position,
          SECTION_DATA.mcu.camera.position,
          SECTION_DATA.mcu.camera.changeCount
        ),
        lookAtAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.bms.camera.lookAt,
          SECTION_DATA.mcu.camera.lookAt,
          SECTION_DATA.mcu.camera.changeCount
        ),
      },
      mcu: {
        positionAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.mcu.camera.position,
          SECTION_DATA.electricMotor.camera.position,
          SECTION_DATA.electricMotor.camera.changeCount
        ),
        lookAtAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.mcu.camera.lookAt,
          SECTION_DATA.electricMotor.camera.lookAt,
          SECTION_DATA.electricMotor.camera.changeCount
        ),
      },
      electricMotor: {
        positionAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.electricMotor.camera.position,
          SECTION_DATA.regenerativeBraking.camera.position,
          SECTION_DATA.regenerativeBraking.camera.changeCount
        ),
        lookAtAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.electricMotor.camera.lookAt,
          SECTION_DATA.regenerativeBraking.camera.lookAt,
          SECTION_DATA.regenerativeBraking.camera.changeCount
        ),
      },
      regenerativeBraking: {
        positionAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.regenerativeBraking.camera.position,
          SECTION_DATA.userReview.camera.position,
          SECTION_DATA.userReview.camera.changeCount
        ),
        lookAtAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.regenerativeBraking.camera.lookAt,
          SECTION_DATA.userReview.camera.lookAt,
          SECTION_DATA.userReview.camera.changeCount
        ),
      },
      userReview: {
        positionAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.userReview.camera.position,
          SECTION_DATA.detail.camera.position,
          SECTION_DATA.detail.camera.changeCount
        ),
        lookAtAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.userReview.camera.lookAt,
          SECTION_DATA.detail.camera.lookAt,
          SECTION_DATA.detail.camera.changeCount
        ),
      },
      detail: undefined,
    };
    this._sectionExecutorInfoMap = sectionExecutorInfoMap;
  }

  get sectionCameraInfoMap() {
    return this._sectionCameraInfoMap;
  }

  get sectionExecutorInfoMap() {
    return this._sectionExecutorInfoMap;
  }

  private getAdditionalVector(originalVector: Vector3, targetVector: Vector3, changeCount: number) {
    return new Vector3(
      (targetVector.x - originalVector.x) / changeCount,
      (targetVector.y - originalVector.y) / changeCount,
      (targetVector.z - originalVector.z) / changeCount
    );
  }

  prev() {
    if (this.activeSectionTypeIndex === 0 || this.activeSectionTypeIndex === 1) return;

    this.activeSectionTypeIndex -= 1;
    this.activeSectionType = SECTION_TYPES[this.activeSectionTypeIndex];
  }

  next() {
    if (this.activeSectionTypeIndex === SECTION_TYPES.length - 1) return;

    this.activeSectionTypeIndex += 1;
    this.activeSectionType = SECTION_TYPES[this.activeSectionTypeIndex];
  }

  getSectionTypeInfo(): SectionTypeInfo {
    return {
      prev:
        this.activeSectionTypeIndex >= 1
          ? (SECTION_TYPES[this.activeSectionTypeIndex - 1] as PrevSectinoType)
          : undefined,
      active: this.activeSectionType,
      next:
        this.activeSectionTypeIndex <= SECTION_TYPES.length - 2
          ? (SECTION_TYPES[this.activeSectionTypeIndex + 1] as NextSectionType)
          : undefined,
    };
  }
}
