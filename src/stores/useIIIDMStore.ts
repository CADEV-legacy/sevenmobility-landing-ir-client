import { create } from 'zustand';

import { MotorcycleIIIDM, SECTION_TYPES, SectionType } from '@/3ds';
import { IIIDMCore } from '@/IIIDM/IIIDMCore';
import { SETTINGS } from '@/settings';

type IIIDMStoreProps = {
  core: IIIDMCore | null;
  motorcycleIIIDM?: MotorcycleIIIDM;
  sectionType: SectionType;
  sectionProgress: number;
} & IIIDMStoreActions;

interface IIIDMStoreActions {
  getMotorcycleIIIDM(): MotorcycleIIIDM | null;
  setSectionType: (newSectionType: SectionType) => void;
  setSectionProgress: (newSectionProgress: number) => void;
}

const DEFAULT_STORE = {
  core: null,
  motorcycleIIIDM: undefined,
  sectionType: SECTION_TYPES[0],
  sectionProgress: 0,
};

export const useIIIDMStore = create<IIIDMStoreProps>((set, get) => ({
  ...DEFAULT_STORE,
  core: typeof window !== 'undefined' ? new IIIDMCore(SETTINGS.isDevMode) : null,
  getMotorcycleIIIDM: () => {
    const { core, motorcycleIIIDM } = get();

    if (!core) return null;

    if (motorcycleIIIDM) return motorcycleIIIDM;

    const newMotorcycleIIIDM = new MotorcycleIIIDM(core);

    set({ motorcycleIIIDM: newMotorcycleIIIDM });

    return newMotorcycleIIIDM;
  },
  setSectionType: newSectionType => {
    const { sectionType } = get();

    if (sectionType === newSectionType) return;

    set({ sectionType: newSectionType });
  },
  setSectionProgress: newSectionProgress => {
    const { sectionProgress } = get();

    if (sectionProgress === newSectionProgress) return;

    set({ sectionProgress: newSectionProgress });
  },
}));
