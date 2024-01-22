import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useSnackbar } from 'notistack';

import * as S from './page.styles';

import { CONTROLLED_SECTIONS, ControlledSection, MotorcycleIIIDM } from '@/3ds';
import { useIIIDMStore } from '@/stores';

const Page: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { getMotorcycleIIIDM, setSection, setSectionProgress } = useIIIDMStore();
  const { enqueueSnackbar } = useSnackbar();
  const motorcycleIIIDMRef = useRef<MotorcycleIIIDM | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [opacityScore, setOpacityScore] = useState(1);

  /**
   * NOTE: Run motorcycleIIIDM when component mounted.
   * - If motorcycleIIIDM is not created yet, create new one.
   * - If motorcycleIIIDM is already created, change POV to target section.
   * - If target section is not valid, throw error.
   */
  useEffect(() => {
    const targetSection = searchParams.get('section');

    try {
      if (!canvasWrapperRef.current) throw new Error('캔버스가 아직 준비되지 않았습니다.');

      if (targetSection && !CONTROLLED_SECTIONS.includes(targetSection as ControlledSection))
        throw new Error('불가능한 섹션이 입력되었습니다.');

      if (!motorcycleIIIDMRef.current) {
        const newMotorcycleIIIDM = getMotorcycleIIIDM();
        const motorcycleSection = searchParams.get('section');

        if (!newMotorcycleIIIDM) throw new Error('오토바이 모델을 불러오는데 실패했습니다.');

        newMotorcycleIIIDM.appendCanvasTo(canvasWrapperRef.current);
        newMotorcycleIIIDM.onLoadProgressAction = progress => {
          setLoadProgress(progress);
        };
        newMotorcycleIIIDM.onLoadCompleteAction = () => {
          setIsLoaded(true);
        };
        newMotorcycleIIIDM.onHideTitleAction = opacityScore => {
          setOpacityScore(opacityScore);
        };
        newMotorcycleIIIDM.setSectionAction = section => {
          setSection(section);
        };
        newMotorcycleIIIDM.setSectionProgressAction = sectionProgress => {
          setSectionProgress(sectionProgress);
        };
        newMotorcycleIIIDM.routeSectionTarget = motorcycleSection as ControlledSection;

        newMotorcycleIIIDM.activate();
        motorcycleIIIDMRef.current = newMotorcycleIIIDM;
      } else {
        motorcycleIIIDMRef.current.changePOVToTargetSection(
          targetSection ? (targetSection as ControlledSection) : 'spec'
        );
      }
    } catch (error) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      enqueueSnackbar((error as any).message, {
        variant: 'error',
      });

      throw error;
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
      <S.LoadProgressOverlay isLoaded={isLoaded}>
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
      )}
    </S.Container>
  );
};

export default Page;
