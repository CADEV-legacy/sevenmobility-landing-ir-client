import { create } from 'zustand';

export const MCU_MODE = ['basic', 'delivery', 'touring'] as const;

type MCUMode = (typeof MCU_MODE)[number];

export type MCUModeProps = {
  d: string;
  stroke: string;
};

type MCUModeMap = { [key in MCUMode]: MCUModeProps };

export const MCU_MODE_MAP: MCUModeMap = {
  basic: {
    d: 'M352.9,167.3L211,77.5L72.5,175L128,333h169L352.9,167.3z',
    stroke: '#FAFF00',
  },
  delivery: {
    d: 'M336,180l-123.8-59L72.5,175L100,384h232L336,180z',
    stroke: '#00F0FF',
  },
  touring: {
    d: 'M402,160.8L212.7,21L62,170l80.9,130.6h138.7L402,160.8z',
    stroke: '#FF0000',
  },
};

type MCUModeStoreProps = {
  mode: MCUMode;
} & MCUModeStoreActions;

interface MCUModeStoreActions {
  setMode: (newMode: MCUMode) => void;
}

const DEFAULT_STORE = {
  mode: 'basic' as MCUMode,
};

export const useMCUModeStore = create<MCUModeStoreProps>((set, get) => ({
  ...DEFAULT_STORE,
  setMode: newMode => {
    const { mode } = get();

    if (mode === newMode) return;

    set({ mode: newMode });
  },
}));
