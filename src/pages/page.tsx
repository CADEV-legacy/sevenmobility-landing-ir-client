import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { useSnackbar } from 'notistack';

import { FloatingContent } from './FloatingContent';
import * as S from './page.styles';

import { CONTROLLED_SECTIONS, ControlledSection, MotorcycleIIIDM } from '@/3ds';
import { Speedometer } from '@/components';
import { useIIIDMStore } from '@/stores';

const Page: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { section, getMotorcycleIIIDM, setSection, setSectionProgress } = useIIIDMStore();
  const { enqueueSnackbar } = useSnackbar();
  const motorcycleIIIDMRef = useRef<MotorcycleIIIDM | null>(null);
  const canvasWrapperRef = useRef<HTMLDivElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [loadProgress, setLoadProgress] = useState(0);
  const [opacityScore, setOpacityScore] = useState(1);

  // NOTE: Floating Content
  const [isFloatingSpecContentVisible, setIsFloatingSpecContentVisible] = useState(false);
  const [isFloatingBatteryContentVisible, setIsFloatingBatteryContentVisible] = useState(false);
  const [isFloatingBMSContentVisible, setIsFloatingBMSContentVisible] = useState(false);
  const [isFloatingMCUContentVisible, setIsFloatingMCUContentVisible] = useState(false);
  const [isFloatingElectricMotorContentVisible, setIsFloatingEletricMotorContentVisible] =
    useState(false);
  const [
    isFloatingRegenerativeBrakingContentVisible,
    setIsFloatingRegenerativeBrakingContentVisible,
  ] = useState(false);
  const [isFloatingUserReviewContentVisible, setIsFloatingUserReviewContentVisible] =
    useState(false);
  const [isFloatingDetailContentVisible, setIsFloatingDetailContentVisible] = useState(false);

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
          setIsFloatingSpecContentVisible(true);
        };
        newMotorcycleIIIDM.onSpecSectionDeactivateAction = () => {
          setIsFloatingSpecContentVisible(false);
        };
        newMotorcycleIIIDM.onBatterySectionActivateAction = () => {
          setIsFloatingBatteryContentVisible(true);
        };
        newMotorcycleIIIDM.onBatterySectionDeactivateAction = () => {
          setIsFloatingBatteryContentVisible(false);
        };
        newMotorcycleIIIDM.onBMSSectionActivateAction = () => {
          setIsFloatingBMSContentVisible(true);
        };
        newMotorcycleIIIDM.onBMSSectionDeactivateAction = () => {
          setIsFloatingBMSContentVisible(false);
        };
        newMotorcycleIIIDM.onMCUSectionActivateAction = () => {
          setIsFloatingMCUContentVisible(true);
        };
        newMotorcycleIIIDM.onMCUSectionDeactivateAction = () => {
          setIsFloatingMCUContentVisible(false);
        };
        newMotorcycleIIIDM.onElectricMotorSectionActivateAction = () => {
          setIsFloatingEletricMotorContentVisible(true);
        };
        newMotorcycleIIIDM.onElectricMotorSectionDeactivateAction = () => {
          setIsFloatingEletricMotorContentVisible(false);
        };
        newMotorcycleIIIDM.onRegenerativeBrakingSectionActivateAction = () => {
          setIsFloatingRegenerativeBrakingContentVisible(true);
        };
        newMotorcycleIIIDM.onRegenerativeBrakingSectionDeactivateAction = () => {
          setIsFloatingRegenerativeBrakingContentVisible(false);
        };
        newMotorcycleIIIDM.onUserReviewSectionActivateAction = () => {
          setIsFloatingUserReviewContentVisible(true);
        };
        newMotorcycleIIIDM.onUserReviewSectionDeactivateAction = () => {
          setIsFloatingUserReviewContentVisible(false);
        };
        newMotorcycleIIIDM.onDetailSectionActivateAction = () => {
          setIsFloatingDetailContentVisible(true);
        };
        newMotorcycleIIIDM.onDetailSectionDeactivateAction = () => {
          setIsFloatingDetailContentVisible(false);
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
      {/* <FloatingTitle
        text='모델 사양'
        top='6%'
        right='6%'
        isVisible={isFloatingSpecDescriptionVisible}
      />
      <FloatingSpecDescription isVisible={isFloatingSpecDescriptionVisible} /> */}
      {/* <FloatingTitle
        text='배터리'
        top='6%'
        left='10%'
        isVisible={isFloatingBatteryDescriptionVisible}
      />
      <FloatingBatteryDescription isVisible={isFloatingBatteryDescriptionVisible} /> */}
      {/* Spec Section */}
      <FloatingContent
        isVisible={isFloatingSpecContentVisible}
        top='6%'
        right='6%'
        flagPosition='top'>
        <div>Spec Title</div>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingSpecContentVisible}
        top='30%'
        right='6%'
        flagPosition='right'>
        <div>Spec Description</div>
      </FloatingContent>
      {/* Battery Section */}
      <FloatingContent
        isVisible={isFloatingBatteryContentVisible}
        top='6%'
        left='10%'
        flagPosition='top'>
        <div>Battery Title</div>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingBatteryContentVisible}
        bottom='6%'
        left='10%'
        flagPosition='left'>
        <div>Battery Description</div>
      </FloatingContent>
      {/* BMS Section */}
      <FloatingContent
        isVisible={isFloatingBMSContentVisible}
        top='6%'
        left='10%'
        flagPosition='top'>
        <div>BMS Title</div>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingBMSContentVisible}
        bottom='30%'
        left='10%'
        flagPosition='left'>
        <div>BMS Description</div>
      </FloatingContent>
      {/* MCU Section */}
      <FloatingContent
        isVisible={isFloatingMCUContentVisible}
        top='6%'
        left='10%'
        flagPosition='top'>
        <div>MCU Title</div>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingMCUContentVisible}
        bottom='30%'
        left='10%'
        flagPosition='left'>
        <div>MCU Description</div>
      </FloatingContent>
      {/* Electric Motor Section */}
      <FloatingContent
        isVisible={isFloatingElectricMotorContentVisible}
        top='6%'
        left='10%'
        flagPosition='top'>
        <div>ElectricMotor Title</div>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingElectricMotorContentVisible}
        bottom='30%'
        left='10%'
        flagPosition='left'>
        <div>ElectricMotor Description</div>
      </FloatingContent>
      {/* Regenerative Braking Section */}
      <FloatingContent
        isVisible={isFloatingRegenerativeBrakingContentVisible}
        top='6%'
        left='10%'
        flagPosition='top'>
        <div>RegenerativeBraking Title</div>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingRegenerativeBrakingContentVisible}
        bottom='30%'
        left='10%'
        flagPosition='left'>
        <div>RegenerativeBraking Description</div>
      </FloatingContent>
      {/* User Review Section */}
      <FloatingContent
        isVisible={isFloatingUserReviewContentVisible}
        top='6%'
        left='10%'
        flagPosition='top'>
        <div>User Review Title</div>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingUserReviewContentVisible}
        bottom='30%'
        left='10%'
        flagPosition='left'>
        <div>User Review Description</div>
      </FloatingContent>
      {/* Detail Section */}
      <FloatingContent
        isVisible={isFloatingDetailContentVisible}
        top='6%'
        left='10%'
        flagPosition='top'>
        <div>Detail Title</div>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingDetailContentVisible}
        bottom='30%'
        left='10%'
        flagPosition='left'>
        <div>Detail Description</div>
      </FloatingContent>
    </S.Container>
  );
};

export default Page;
