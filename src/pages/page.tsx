import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';

import { Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import { FloatingContent } from './FloatingContent';
import { MCUStatusPentagram } from './MCUStatusPentagram';
import * as S from './page.styles';
import { Speedometer } from './Speedometer';

import { CONTROLLED_SECTIONS, ControlledSection, MotorcycleIIIDM } from '@/3ds';
import BatteryTitleKRIcon from '@/assets/icons/Tbattery.svg';
import BMSTitleKRIcon from '@/assets/icons/Tbms.svg';
import DetailTitleKRIcon from '@/assets/icons/Tdetail.svg';
import MCUTitleKRIcon from '@/assets/icons/Tmcu.svg';
import MotorTitleKRIcon from '@/assets/icons/Tmotor.svg';
import SpecTitleKRIcon from '@/assets/icons/Tspec.svg';
import UserReviewTitleKRIcon from '@/assets/icons/Tuserreview.svg';
import { SWImage } from '@/components';
import { COLOR } from '@/constants';
import { useIIIDMStore, useMCUModeStore } from '@/stores';

const Page: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { section, getMotorcycleIIIDM, setSection, setSectionProgress } = useIIIDMStore();
  const { mode } = useMCUModeStore();
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
      {/* Speedometer */}
      <S.FloatingSpeedmeterContainer>
        <Speedometer />
      </S.FloatingSpeedmeterContainer>
      {/* Spec Section */}
      <FloatingContent
        isVisible={isFloatingSpecContentVisible}
        top='6%'
        right='6%'
        flagPosition='top'>
        <S.FloatingSpecTitleKRContainer>
          <SWImage alt='spec-title-kr' src={SpecTitleKRIcon} objectFit={['contain']} />
        </S.FloatingSpecTitleKRContainer>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingSpecContentVisible}
        top='30%'
        right='6%'
        flagPosition='right'>
        <S.FloatingSpecDescriptionContainer>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ marginBottom: '3rem', fontSize: '3rem' }}>
            SM1
          </Typography>
          <Typography variant='h1' sx={{ fontSize: '1.5rem' }}>
            주행 거리 <strong style={{ fontSize: '2rem' }}>158km</strong>
          </Typography>
          <Typography variant='h1' sx={{ fontSize: '1.5rem' }}>
            최고 속도 <strong style={{ fontSize: '2rem' }}>100km/h</strong>
          </Typography>
          <Typography variant='h1' sx={{ fontSize: '1.5rem' }}>
            모터 출력 <strong style={{ fontSize: '2rem' }}>7kW</strong>
          </Typography>
        </S.FloatingSpecDescriptionContainer>
      </FloatingContent>
      {/* Battery Section */}
      <FloatingContent
        isVisible={isFloatingBatteryContentVisible}
        top='6%'
        left='10%'
        flagPosition='top'
        isCentered>
        <S.FloatingBatteryTitleKRContainer>
          <SWImage alt='battery-title-kr' src={BatteryTitleKRIcon} objectFit={['contain']} />
        </S.FloatingBatteryTitleKRContainer>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingBatteryContentVisible}
        bottom='6%'
        left='10%'
        flagPosition='left'>
        <S.FloatingBatteryDescriptionContainer>
          <S.BatteryDescriptionKeywordFlexContainer>
            <S.BatteryDescriptionKeyWord color={COLOR.grayScale10}>
              <Typography variant='h3' fontWeight='bold'>
                충 전 시 간
              </Typography>
            </S.BatteryDescriptionKeyWord>
            <S.BatteryDescriptionKeyWord color={COLOR.grayScale40}>
              <Typography variant='h3' fontWeight='bold'>
                주 행 거 리
              </Typography>
            </S.BatteryDescriptionKeyWord>
            <S.BatteryDescriptionKeyWord color={COLOR.grayScale60}>
              <Typography variant='h3' fontWeight='bold'>
                편 리 성
              </Typography>
            </S.BatteryDescriptionKeyWord>
          </S.BatteryDescriptionKeywordFlexContainer>
          <S.DescriptionFlexContainer>
            <S.DescriptionPart>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ marginBottom: '3rem', fontSize: '3rem' }}>
                초고속 충전
              </Typography>
              <Typography variant='h2' fontWeight='bold' sx={{ marginBottom: '1.5rem' }}>
                30분 만에 100% 충전 가능, 스테이션 불필요.
              </Typography>
              <Typography variant='h2' fontWeight='bold' sx={{ marginBottom: '1.5rem' }}>
                고압 충전 시 발열 문제를 해결하여 안전성 증가.
              </Typography>
            </S.DescriptionPart>
            <S.DescriptionPart>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ marginBottom: '3rem', fontSize: '3rem' }}>
                압도적인 주행 거리
              </Typography>
              <Typography variant='h2' fontWeight='bold' sx={{ marginBottom: '0.5rem' }}>
                1회 충전시 주행 거리 104km
              </Typography>
              <Typography variant='h5' sx={{ marginBottom: '1.5rem' }}>
                환경부 시험방법 기준 (CSV-40)
              </Typography>
              <Typography variant='h2' fontWeight='bold' sx={{ marginBottom: '0.5rem' }}>
                72V / 60Ah 배터리로 60km 정속 주행 시 158km 주행 가능
              </Typography>
              <Typography variant='h5' sx={{ marginBottom: '1.5rem' }}>
                자체 테스트 결과
              </Typography>
            </S.DescriptionPart>
          </S.DescriptionFlexContainer>
        </S.FloatingBatteryDescriptionContainer>
      </FloatingContent>
      {/* BMS Section */}
      <FloatingContent
        isVisible={isFloatingBMSContentVisible}
        top='6%'
        left='10%'
        flagPosition='top'>
        <S.FloatingBMSTitleKRContainer>
          <SWImage alt='bms-title-kr' src={BMSTitleKRIcon} objectFit={['contain']} />
        </S.FloatingBMSTitleKRContainer>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingBMSContentVisible}
        bottom='40%'
        left='10%'
        flagPosition='left'>
        <S.FloatingBMSContentContainer>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            자체 설계로 직병렬 호환 가능 (특허 진행 중)
          </Typography>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            1M 배터리와 분리 장착해도 통신 장애없이 설계 (세계 최초, 특허 진행 중)
          </Typography>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            배터리와 분리되게 설계하여 안전성 확보. 1M이상 분리 가능.
          </Typography>
        </S.FloatingBMSContentContainer>
      </FloatingContent>
      {/* MCU Section */}
      <FloatingContent
        isVisible={isFloatingMCUContentVisible}
        top='6%'
        left='10%'
        flagPosition='top'
        isCentered>
        <S.FloatingBMSTitleKRContainer>
          <SWImage alt='mcu-title-kr' src={MCUTitleKRIcon} objectFit={['contain']} />
        </S.FloatingBMSTitleKRContainer>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingMCUContentVisible}
        bottom='30%'
        left='10%'
        flagPosition='left'>
        <S.FloatingMCUStatusPentagramContainer>
          <MCUStatusPentagram />
        </S.FloatingMCUStatusPentagramContainer>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingMCUContentVisible}
        top='30%'
        right='2%'
        flagPosition='right'>
        <S.FloatingMCUContentContainer>
          {mode === 'basic' && (
            <>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                BASIC
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                일상생활 또는 출퇴근용에 맞는 세팅 속도, 힘(등판력)
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                에너지 효율을 기본으로 적당한 속도와 힘
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                주행거리 모두 최적화한 모드
              </Typography>
            </>
          )}
          {mode === 'delivery' && (
            <>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                DELIVERY
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                생계형 사용자 세팅
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                에너지효율을 최고치로 끌어올려
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                최대한 충전횟수를 줄이고 오래 탈 수 있다.
              </Typography>
            </>
          )}
          {mode === 'touring' && (
            <>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '3rem', marginBottom: '0.5rem' }}>
                TOURING
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                투어링을 즐기는 사용자 세팅
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                모터의 힘을 최대로 끌어올려
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                고속주행을 원하는 사용자에게 재미를 선사한다.
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}></Typography>
            </>
          )}
        </S.FloatingMCUContentContainer>
      </FloatingContent>
      {/* Electric Motor Section */}
      <FloatingContent
        isVisible={isFloatingElectricMotorContentVisible}
        top='6%'
        right='10%'
        flagPosition='top'>
        <S.FloatingMotorTitleKRContainer>
          <SWImage alt='electric-motor-title-kr' src={MotorTitleKRIcon} objectFit={['contain']} />
        </S.FloatingMotorTitleKRContainer>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingElectricMotorContentVisible}
        top='30%'
        right='10%'
        flagPosition='right'>
        <S.FloatingMotorContentContainer>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
            더 빠르고 강한 모터
          </Typography>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            더 빠르고 강한, 자체 설계한 In Wheel 모터
          </Typography>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            최고 속력 100km/h
          </Typography>
          <Typography sx={{ fontSize: '1rem' }}>
            <strong>·</strong> D사 72V/45Ah 최고 속력: 90km/h
          </Typography>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            우수한 등판력
          </Typography>
        </S.FloatingMotorContentContainer>
      </FloatingContent>
      {/* Regenerative Braking Section */}
      <FloatingContent
        isVisible={isFloatingRegenerativeBrakingContentVisible}
        top='6%'
        left='10%'
        flagPosition='top'
        isCentered>
        <div>RegenerativeBraking Title</div>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingRegenerativeBrakingContentVisible}
        bottom='6%'
        left='30%'
        flagPosition='bottom'>
        <S.FloatingRegenrativeBrakingContentContainer>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '3rem', marginBottom: '1.5rem' }}>
            효율적인 에너지 사용
          </Typography>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            달리면 달릴수록 충전되는 에너지
          </Typography>
          <Typography sx={{ fontSize: '1rem' }}>
            <strong>·</strong> 회생제동 기능을 통해 총 <strong>30%</strong> 의 에너지 효율 증대
          </Typography>
        </S.FloatingRegenrativeBrakingContentContainer>
      </FloatingContent>
      {/* User Review Section */}
      <FloatingContent
        isVisible={isFloatingUserReviewContentVisible}
        top='6%'
        left='10%'
        flagPosition='top'>
        <S.FloatingMotorTitleKRContainer>
          <SWImage alt='user-review-title-kr' src={UserReviewTitleKRIcon} objectFit={['contain']} />
        </S.FloatingMotorTitleKRContainer>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingUserReviewContentVisible}
        bottom='30%'
        left='10%'
        flagPosition='left'>
        <S.FloatingUserReviewContentContainer>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            전기 오토바이의 선입견을 깬 오토바이
          </Typography>
          <Typography sx={{ fontSize: '1rem' }}>파워가 말도 안되네요</Typography>
        </S.FloatingUserReviewContentContainer>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingUserReviewContentVisible}
        bottom='6%'
        left='30%'
        flagPosition='bottom'>
        <S.FloatingUserReviewContentContainer>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            효율성이 엄청납니다.
          </Typography>
          <Typography sx={{ fontSize: '1rem' }}>전기세가 확 줄은게 체감이되요</Typography>
        </S.FloatingUserReviewContentContainer>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingUserReviewContentVisible}
        bottom='6%'
        right='30%'
        flagPosition='bottom'>
        <S.FloatingUserReviewContentContainer>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            미친 가격이네요
          </Typography>
          <Typography sx={{ fontSize: '1rem' }}>
            지원금까지 합하니 말도안되는 가성비라 생각합니다.
          </Typography>
        </S.FloatingUserReviewContentContainer>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingUserReviewContentVisible}
        bottom='30%'
        right='10%'
        flagPosition='right'>
        <S.FloatingUserReviewContentContainer>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            주행감이 진짜 좋은데요?
          </Typography>
          <Typography sx={{ fontSize: '1rem' }}>
            내연 오토바이를 원래 좋아해서 자주 타고 다녔는데, 주행감이 진짜 비슷하네요.
          </Typography>
        </S.FloatingUserReviewContentContainer>
      </FloatingContent>
      {/* Detail Section */}
      <FloatingContent
        isVisible={isFloatingDetailContentVisible}
        top='6%'
        left='10%'
        flagPosition='top'>
        <S.FloatingDetailTitleKRContainer>
          <SWImage alt='detail-title-kr' src={DetailTitleKRIcon} objectFit={['contain']} />
        </S.FloatingDetailTitleKRContainer>
      </FloatingContent>
      <FloatingContent
        isVisible={isFloatingDetailContentVisible}
        bottom='6%'
        left='10%'
        flagPosition='left'>
        <S.FloatingDetailContentContainer>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '2rem', marginBottom: '1rem' }}>
            차량 제원
          </Typography>
          <S.DetailContentSection>
            <S.DetailContentSectionArea>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>엔진형식</S.DetailContentTitle>
                <S.DetailContentDescription>수랭 직렬 4기통 슈퍼차저</S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>배기량</S.DetailContentTitle>
                <S.DetailContentDescription>998cc</S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>압축비</S.DetailContentTitle>
                <S.DetailContentDescription>11.2 : 1</S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>최고출력</S.DetailContentTitle>
                <S.DetailContentDescription>200ps (147.1kW) / 11,000rpm</S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>최대토크</S.DetailContentTitle>
                <S.DetailContentDescription>
                  137.0Nm (14.0kgf.m) / 8,500rpm
                </S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>시트고</S.DetailContentTitle>
                <S.DetailContentDescription>830mm</S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>연료탱크 용량</S.DetailContentTitle>
                <S.DetailContentDescription>19 liters</S.DetailContentDescription>
              </S.DetailContentFlexBox>
            </S.DetailContentSectionArea>
            <S.DetailContentSectionArea>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>브레이크</S.DetailContentTitle>
                <S.DetailContentDescription>
                  전륜 320mm 듀얼 세미 플로팅 디스크 / 브램보 스틸레마 캘리퍼
                  <br />
                  후륜 260mm 싱글디스크 / 싱글 피스톤 캘리퍼
                </S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>서스펜션</S.DetailContentTitle>
                <S.DetailContentDescription>
                  전륜 43mm KECS - 전자식 풀 어저스터블 도립식 포크
                  <br />
                  후륜 수평 백링크 KECS - 전자식 풀 어저스터블 쇽업쇼버
                </S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>타이어</S.DetailContentTitle>
                <S.DetailContentDescription>
                  전륜 120 / 70ZR17M/C (58W)
                  <br />
                  후륜 190 / 55ZR17M/C (75W)
                </S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>차량중량</S.DetailContentTitle>
                <S.DetailContentDescription>240kg</S.DetailContentDescription>
              </S.DetailContentFlexBox>
            </S.DetailContentSectionArea>
          </S.DetailContentSection>
        </S.FloatingDetailContentContainer>
      </FloatingContent>
    </S.Container>
  );
};

export default Page;
