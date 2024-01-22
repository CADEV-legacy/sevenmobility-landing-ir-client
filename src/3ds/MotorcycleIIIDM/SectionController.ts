import { Vector3 } from 'three';

import { SECTION_DATA } from './resources';

export type Section = keyof typeof SECTION_DATA;

export const SECTIONS: Section[] = [
  'loading',
  'spec',
  'battery',
  'bms',
  'mcu',
  'electricMotor',
  'regenerativeBraking',
  'userReview',
  'detail',
];

export type ControlledSection = Exclude<Section, 'loading'>;

export const CONTROLLED_SECTIONS: ControlledSection[] = [
  'spec',
  'battery',
  'bms',
  'mcu',
  'electricMotor',
  'regenerativeBraking',
  'userReview',
  'detail',
];

type SectionInfoProps = {
  positionAdditionalVector: Vector3;
  lookAtAdditionalVector: Vector3;
  isActive: boolean;
};

interface SectionInfoActions {
  activate?: () => void;
  deactivate?: () => void;
}

type ControlledSectionInfoActions = { [key in ControlledSection]?: SectionInfoActions };

type SectionInfo = SectionInfoProps & SectionInfoActions;

type ControlledSectionInfo = {
  [key in ControlledSection]: SectionInfo;
};

export class SectionController {
  private _prevControlledSection: ControlledSection | undefined = undefined;
  private _activeControlledSection: 'loading' | ControlledSection = 'loading';
  private _nextControlledSection: ControlledSection | undefined = 'spec';
  private _controlledSectionInfo: ControlledSectionInfo;

  constructor(controlledSectionInfoActions: ControlledSectionInfoActions) {
    this._controlledSectionInfo = {
      spec: {
        positionAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.loading.camera.position,
          SECTION_DATA.spec.camera.position,
          SECTION_DATA.spec.camera.changeCount
        ),
        lookAtAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.loading.camera.lookAt,
          SECTION_DATA.spec.camera.lookAt,
          SECTION_DATA.spec.camera.changeCount
        ),
        isActive: false,
        ...controlledSectionInfoActions.spec,
      },
      battery: {
        positionAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.spec.camera.position,
          SECTION_DATA.battery.camera.position,
          SECTION_DATA.battery.camera.changeCount
        ),
        lookAtAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.spec.camera.lookAt,
          SECTION_DATA.battery.camera.lookAt,
          SECTION_DATA.battery.camera.changeCount
        ),
        isActive: false,
        ...controlledSectionInfoActions.battery,
      },
      bms: {
        positionAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.battery.camera.position,
          SECTION_DATA.bms.camera.position,
          SECTION_DATA.bms.camera.changeCount
        ),
        isActive: false,
        lookAtAdditionalVector: this.getAdditionalVector(
          SECTION_DATA.battery.camera.lookAt,
          SECTION_DATA.bms.camera.lookAt,
          SECTION_DATA.bms.camera.changeCount
        ),
        ...controlledSectionInfoActions.bms,
      },
      mcu: {
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
        isActive: false,
        ...controlledSectionInfoActions.mcu,
      },
      electricMotor: {
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
        isActive: false,
        ...controlledSectionInfoActions.electricMotor,
      },
      regenerativeBraking: {
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
        isActive: false,
        ...controlledSectionInfoActions.regenerativeBraking,
      },
      userReview: {
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
        isActive: false,
        ...controlledSectionInfoActions.userReview,
      },
      detail: {
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
        isActive: false,
        ...controlledSectionInfoActions.detail,
      },
    };
  }

  get prevControlledSection() {
    return this._prevControlledSection;
  }

  get activeControlledSection() {
    return this._activeControlledSection;
  }

  get nextControlledSection() {
    return this._nextControlledSection;
  }

  get controlledSectionInfo() {
    return this._controlledSectionInfo;
  }

  getAdditionalVector(originalVector: Vector3, targetVector: Vector3, changeCount: number) {
    return new Vector3(
      (targetVector.x - originalVector.x) / changeCount,
      (targetVector.y - originalVector.y) / changeCount,
      (targetVector.z - originalVector.z) / changeCount
    );
  }

  prev() {
    if (this._activeControlledSection === 'loading') return;

    const activeControlledSectionIndex = CONTROLLED_SECTIONS.indexOf(this._activeControlledSection);

    if (activeControlledSectionIndex <= 0) return;

    this._activeControlledSection = CONTROLLED_SECTIONS[activeControlledSectionIndex - 1];

    if (activeControlledSectionIndex === 1) {
      this._prevControlledSection = undefined;
    } else {
      this._prevControlledSection = CONTROLLED_SECTIONS[activeControlledSectionIndex - 2];
    }

    this._nextControlledSection = CONTROLLED_SECTIONS[activeControlledSectionIndex];
  }

  next() {
    if (this._activeControlledSection === 'loading') {
      this._prevControlledSection = undefined;
      this._activeControlledSection = CONTROLLED_SECTIONS[0];
      this._nextControlledSection = CONTROLLED_SECTIONS[1];

      return;
    }

    const activeControlledSectionIndex = CONTROLLED_SECTIONS.indexOf(this._activeControlledSection);

    if (activeControlledSectionIndex === CONTROLLED_SECTIONS.length - 1) return;

    this._activeControlledSection = CONTROLLED_SECTIONS[activeControlledSectionIndex + 1];

    if (activeControlledSectionIndex === CONTROLLED_SECTIONS.length - 2) {
      this._prevControlledSection = CONTROLLED_SECTIONS[activeControlledSectionIndex];
      this._nextControlledSection = undefined;
      return;
    }

    this._prevControlledSection = CONTROLLED_SECTIONS[activeControlledSectionIndex];
    this._nextControlledSection = CONTROLLED_SECTIONS[activeControlledSectionIndex + 2];
  }

  changeActiveControlledSection(newActiveControlledSection: ControlledSection) {
    if (
      this._activeControlledSection === newActiveControlledSection ||
      this._activeControlledSection === 'loading'
    )
      return;

    const newActiveControlledSectionIndex = CONTROLLED_SECTIONS.indexOf(newActiveControlledSection);

    this._activeControlledSection = newActiveControlledSection;

    if (newActiveControlledSectionIndex === 0) {
      this._prevControlledSection = undefined;
      this._nextControlledSection = CONTROLLED_SECTIONS[1];

      return;
    }

    if (newActiveControlledSectionIndex === CONTROLLED_SECTIONS.length - 1) {
      this._prevControlledSection = CONTROLLED_SECTIONS[newActiveControlledSectionIndex - 1];
      this._nextControlledSection = undefined;

      return;
    }

    this._prevControlledSection = CONTROLLED_SECTIONS[newActiveControlledSectionIndex - 1];
    this._nextControlledSection = CONTROLLED_SECTIONS[newActiveControlledSectionIndex + 1];
  }
}
