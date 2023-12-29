import { create } from 'zustand';

import { MotorcycleIIIDM } from '@/3ds';
import { IIIDMCore } from '@/IIIDM/IIIDMCore';
import { CLIENT_SETTINGS } from '@/settings';

type IIIDMStoreProps = {
  core: IIIDMCore | null;
  motorcycleIIIDM?: MotorcycleIIIDM;
} & IIIDMStoreActions;

interface IIIDMStoreActions {
  getMotorcycleIIIDM(): MotorcycleIIIDM | null;
}

export const useIIIDMStore = create<IIIDMStoreProps>((set, get) => ({
  core: typeof window !== 'undefined' ? new IIIDMCore(CLIENT_SETTINGS.isDevMode) : null,
  getMotorcycleIIIDM: () => {
    const { core, motorcycleIIIDM } = get();

    if (!core) return null;

    if (motorcycleIIIDM) return motorcycleIIIDM;

    const newMotorcycleIIIDM = new MotorcycleIIIDM(core);

    set({ motorcycleIIIDM: newMotorcycleIIIDM });

    return newMotorcycleIIIDM;
  },
}));
