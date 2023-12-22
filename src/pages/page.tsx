import { useEffect, useRef, useState } from 'react';

import * as S from './page.styles';

import { MotorcycleIIIDM } from '@/3ds';
import { useIIIDMStore } from '@/stores';

const Page: React.FC = () => {
  const { getNewMotorcycleIIIDM } = useIIIDMStore();
  const motorcycleIIIDMRef = useRef<MotorcycleIIIDM | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);

  const runMotorcycleIIIDM = () => {
    if (!canvasWrapperRef.current) throw new Error('Canvas wrapper not rendered yet.');

    if (!motorcycleIIIDMRef.current) {
      const newMotorcycleIIIDM = getNewMotorcycleIIIDM();

      if (!newMotorcycleIIIDM) throw new Error('Failed to get new motorcycleIIIDM.');

      newMotorcycleIIIDM.appendCanvasTo(canvasWrapperRef.current);
      newMotorcycleIIIDM.onLoadProgressAction = progress => {
        setLoadProgress(progress);
      };
      newMotorcycleIIIDM.onLoadCompleteAction = () => {
        setIsLoaded(true);
      };
      newMotorcycleIIIDM.activate();
      motorcycleIIIDMRef.current = newMotorcycleIIIDM;

      console.info('MotorcycleIIIDM initialized.', newMotorcycleIIIDM);
    } else {
      motorcycleIIIDMRef.current.activate();
    }
  };

  // NOTE: Initialize motorcycleIIIDM.
  useEffect(() => {
    runMotorcycleIIIDM();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // NOTE: Handle resize event for motorcycleIIIDM.
  useEffect(() => {
    if (!motorcycleIIIDMRef.current) return;

    const motorcycleIIIDM = motorcycleIIIDMRef.current;

    window.addEventListener('resize', motorcycleIIIDM.resize.bind(motorcycleIIIDM));
    return () => {
      window.removeEventListener('resize', motorcycleIIIDM.resize.bind(motorcycleIIIDM));

      motorcycleIIIDM.dispose();
    };
  }, []);

  return (
    <S.Container>
      <S.CanvasWrapper ref={canvasWrapperRef} />
      <S.LoadProgressOverlay isLoaded={isLoaded}>
        <S.LoadProgressText>
          Loading......
          <br />
          {loadProgress}%
        </S.LoadProgressText>
      </S.LoadProgressOverlay>
    </S.Container>
  );
};

export default Page;
