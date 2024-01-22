import { create } from 'zustand';

import { ControlledSection, MotorcycleIIIDM, Section } from '@/3ds';
import { IIIDMCore } from '@/IIIDM/IIIDMCore';
import { SETTINGS } from '@/settings';

type IIIDMStoreProps = {
  core: IIIDMCore | null;
  motorcycleIIIDM?: MotorcycleIIIDM;
  section: Section;
  sectionProgress: number;
} & IIIDMStoreActions;

interface IIIDMStoreActions {
  getMotorcycleIIIDM(): MotorcycleIIIDM | null;
  setSection: (newSection: ControlledSection) => void;
  setSectionProgress: (newSectionProgress: number) => void;
}

const DEFAULT_STORE = {
  core: null,
  motorcycleIIIDM: undefined,
  section: 'loading' as Section,
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
  setSection: newSection => {
    const { section } = get();

    if (section === newSection) return;

    set({ section: newSection });
  },
  setSectionProgress: newSectionProgress => {
    const { sectionProgress } = get();

    if (sectionProgress === newSectionProgress) return;

    set({ sectionProgress: newSectionProgress });
  },
}));
