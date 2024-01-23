import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useSnackbar } from 'notistack';

import { FloatingSpecDescription } from './FloatingSpecDescription';
import * as S from './page.styles';

import { CONTROLLED_SECTIONS, ControlledSection, MotorcycleIIIDM } from '@/3ds';
import { Speedometer } from '@/components';
import { useIIIDMStore } from '@/stores';
import { FloatingBatteryDescription } from './FloatingBatteryDescription';
import { FloatingTitle } from './FloatingTitle';

const Page: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { section, getMotorcycleIIIDM, setSection, setSectionProgress } = useIIIDMStore();
  const { enqueueSnackbar } = useSnackbar();
  const motorcycleIIIDMRef = useRef<MotorcycleIIIDM | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [opacityScore, setOpacityScore] = useState(1);
  const [isFloatingSpecDescriptionVisible, setIsFloatingSpecDescriptionVisible] = useState(false);
  const [isFloatingBatteryDescriptionVisible, setIsFloatingBatteryDescriptionVisible] =
    useState(false);
  const [isFloatingBMSDescriptionVisible, setIsFloatingBMSDescriptionVisible] = useState(false);
  const [isFloatingMCUDescriptionVisible, setIsFloatingMCUDescriptionVisible] = useState(false);
  const [isFloatingElectricMotorDescriptionVisible, setIsFloatingElectricMotorDescriptionVisible] =
    useState(false);
  const [
    isFloatingRegenerativeBrakingDescriptionVisible,
    setIsFloatingRegenerativeBrakingDescriptionVisible,
  ] = useState(false);
  const [isFloatingUserReviewDescriptionVisible, setIsFloatingUserReviewDescriptionVisible] =
    useState(false);
  const [isFloatingDetailDescriptionVisible, setIsFloatingDetailDescriptionVisible] =
    useState(false);

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
        newMotorcycleIIIDM.onSpecSectionActivateAction = () => {
          setIsFloatingSpecDescriptionVisible(true);
        };
        newMotorcycleIIIDM.onSpecSectionDeactivateAction = () => {
          setIsFloatingSpecDescriptionVisible(false);
        };
        newMotorcycleIIIDM.onBatterySectionActivateAction = () => {
          setIsFloatingBatteryDescriptionVisible(true);
        };
        newMotorcycleIIIDM.onBatterySectionDeactivateAction = () => {
          setIsFloatingBatteryDescriptionVisible(false);
        };
        newMotorcycleIIIDM.onBMSSectionActivateAction = () => {
          setIsFloatingBMSDescriptionVisible(true);
        };
        newMotorcycleIIIDM.onBMSSectionDeactivateAction = () => {
          setIsFloatingBMSDescriptionVisible(false);
        };
        newMotorcycleIIIDM.onMCUSectionActivateAction = () => {
          setIsFloatingMCUDescriptionVisible(true);
        };
        newMotorcycleIIIDM.onMCUSectionDeactivateAction = () => {
          setIsFloatingMCUDescriptionVisible(false);
        };
        newMotorcycleIIIDM.onElectricMotorSectionActivateAction = () => {
          setIsFloatingElectricMotorDescriptionVisible(true);
        };
        newMotorcycleIIIDM.onElectricMotorSectionDeactivateAction = () => {
          setIsFloatingElectricMotorDescriptionVisible(false);
        };
        newMotorcycleIIIDM.onRegenerativeBrakingSectionActivateAction = () => {
          setIsFloatingRegenerativeBrakingDescriptionVisible(true);
        };
        newMotorcycleIIIDM.onRegenerativeBrakingSectionDeactivateAction = () => {
          setIsFloatingRegenerativeBrakingDescriptionVisible(false);
        };
        newMotorcycleIIIDM.onUserReviewSectionActivateAction = () => {
          setIsFloatingUserReviewDescriptionVisible(true);
        };
        newMotorcycleIIIDM.onUserReviewSectionDeactivateAction = () => {
          setIsFloatingUserReviewDescriptionVisible(false);
        };
        newMotorcycleIIIDM.onDetailSectionActivateAction = () => {
          setIsFloatingDetailDescriptionVisible(true);
        };
        newMotorcycleIIIDM.onDetailSectionDeactivateAction = () => {
          setIsFloatingDetailDescriptionVisible(false);
        };

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
      {!isLoaded && (
        <S.LoadProgressOverlay isLoaded={isLoaded}>
          <S.LoadProgressText>
            Loading......
            <br />
            {loadProgress}%
          </S.LoadProgressText>
        </S.LoadProgressOverlay>
      )}
      {isLoaded && section === 'loading' && (
        <S.Overlay isLoaded={isLoaded}>
          <S.Title opacityScore={opacityScore}>
            우리는 지속 가능한 미래 모빌리티를 만듭니다.
          </S.Title>
          <S.Title opacityScore={opacityScore}>새로움과 혁신을 담다, 세븐모빌리티</S.Title>
        </S.Overlay>
      )}
      <S.FloatingSpeedmeterContainer>
        <Speedometer />
      </S.FloatingSpeedmeterContainer>
      <FloatingTitle
        text='모델 사양'
        top='6%'
        right='6%'
        isVisible={isFloatingSpecDescriptionVisible}
      />
      <FloatingSpecDescription isVisible={isFloatingSpecDescriptionVisible} />
      <FloatingTitle
        text='배터리'
        top='6%'
        left='10%'
        isVisible={isFloatingBatteryDescriptionVisible}
      />
      <FloatingBatteryDescription isVisible={isFloatingBatteryDescriptionVisible} />
    </S.Container>
  );
};

export default Page;
