import { useEffect, useRef, useState } from 'react';

import * as S from './page.styles';

import { MotorcycleIIIDM } from '@/3ds';
import { useIIIDMStore } from '@/stores';

const Page: React.FC = () => {
  const { getMotorcycleIIIDM } = useIIIDMStore();
  const motorcycleIIIDMRef = useRef<MotorcycleIIIDM | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [opacityScore, setOpacityScore] = useState(1);

  const runMotorcycleIIIDM = () => {
    if (!canvasWrapperRef.current) throw new Error('Canvas wrapper not rendered yet.');

    if (!motorcycleIIIDMRef.current) {
      const newMotorcycleIIIDM = getMotorcycleIIIDM();

      if (!newMotorcycleIIIDM) throw new Error('Failed to get new motorcycleIIIDM.');

      newMotorcycleIIIDM.appendCanvasTo(canvasWrapperRef.current);
      newMotorcycleIIIDM.onLoadProgressAction = progress => {
        setLoadProgress(progress);
        console.info('Page progress:', progress);
      };
      newMotorcycleIIIDM.onLoadCompleteAction = () => {
        setIsLoaded(true);
      };
      newMotorcycleIIIDM.onHideTitleAction = opacityScore => {
        setOpacityScore(opacityScore);
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
    window.addEventListener('wheel', motorcycleIIIDM.scroll.bind(motorcycleIIIDM));
    return () => {
      window.removeEventListener('resize', motorcycleIIIDM.resize.bind(motorcycleIIIDM));
      window.removeEventListener('wheel', motorcycleIIIDM.scroll.bind(motorcycleIIIDM));

      motorcycleIIIDM.dispose();
    };
  }, []);

  return (
    <S.Container>
      <S.CanvasWrapper ref={canvasWrapperRef} />
      {/* <S.LoadProgressOverlay isLoaded={isLoaded}>
        <S.LoadProgressText>
          Loading......
          <br />
          {loadProgress}%
        </S.LoadProgressText>
      </S.LoadProgressOverlay>
      {isLoaded && (
        <S.Overlay isLoaded={isLoaded}>
          <S.Title opacityScore={opacityScore}>
            우리는 지속 가능한 미래 모빌리티를 만듭니다.
          </S.Title>
          <S.Title opacityScore={opacityScore}>새로움과 혁신을 담다, 세븐모빌리티</S.Title>
        </S.Overlay>
      )} */}
    </S.Container>
  );
};

export default Page;
