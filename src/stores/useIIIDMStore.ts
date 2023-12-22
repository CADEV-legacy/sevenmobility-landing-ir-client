import { create } from 'zustand';

import { MotorcycleIIIDM } from '@/3ds';
import { IIIDMCore } from '@/IIIDM/IIIDMCore';
import { CLIENT_SETTINGS } from '@/settings';

type IIIDMStoreProps = {
  core: IIIDMCore | null;
  motorCycleIIIDM?: MotorcycleIIIDM;
} & IIIDMStoreActions;

interface IIIDMStoreActions {
  getNewMotorcycleIIIDM(): MotorcycleIIIDM | null;
}

export const useIIIDMStore = create<IIIDMStoreProps>((set, get) => ({
  core: typeof window !== 'undefined' ? new IIIDMCore(false) : null,
  getNewMotorcycleIIIDM: () => {
    const { core, motorCycleIIIDM } = get();

    if (!core) return null;

    if (motorCycleIIIDM) motorCycleIIIDM.dispose();

    const newMotorcycleIIIDM = new MotorcycleIIIDM(core);

    set({ motorCycleIIIDM: newMotorcycleIIIDM });

    return newMotorcycleIIIDM;
  },
}));
