import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
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
  const { t } = useTranslation();
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
        throw new Error(t('error.impossible_section_entered'));

      if (!motorcycleIIIDMRef.current) {
        const newMotorcycleIIIDM = getMotorcycleIIIDM();
        const motorcycleSection = searchParams.get('section');

        if (!newMotorcycleIIIDM) throw new Error(t('error.failed_to_load_the_motorcycle_model'));

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
            {t('title.we_are_creating_a_sustainable_future_for_mobility')}
          </S.Title>
          <S.Title opacityScore={opacityScore}>
            {t('title.innovation_and_novelty_encapsulated_seven_mobility')}
          </S.Title>
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
            {t('section_spec.driving_distance')} <strong style={{ fontSize: '2rem' }}>158km</strong>
          </Typography>
          <Typography variant='h1' sx={{ fontSize: '1.5rem' }}>
            {t('section_spec.maximum_speed')} <strong style={{ fontSize: '2rem' }}>100km/h</strong>
          </Typography>
          <Typography variant='h1' sx={{ fontSize: '1.5rem' }}>
            {t('section_spec.motor_output')} <strong style={{ fontSize: '2rem' }}>7kW</strong>
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
              <Typography variant='h4' fontWeight='bold'>
                {t('section_battery.charing_time')}
              </Typography>
            </S.BatteryDescriptionKeyWord>
            <S.BatteryDescriptionKeyWord color={COLOR.grayScale40}>
              <Typography variant='h4' fontWeight='bold'>
                {t('section_battery.driving_distance')}
              </Typography>
            </S.BatteryDescriptionKeyWord>
            <S.BatteryDescriptionKeyWord color={COLOR.grayScale60}>
              <Typography variant='h4' fontWeight='bold'>
                {t('section_battery.convenience')}
              </Typography>
            </S.BatteryDescriptionKeyWord>
          </S.BatteryDescriptionKeywordFlexContainer>
          <S.DescriptionFlexContainer>
            <S.DescriptionPart>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ marginBottom: '3rem', fontSize: '1.5rem' }}>
                {t('section_battery.ultra_fast_charging')}
              </Typography>
              <Typography variant='h3' fontWeight='bold' sx={{ marginBottom: '1.5rem' }}>
                {t('section_battery.30_minutes_to_fully_charge_no_need_for_a_station')}
              </Typography>
              <Typography variant='h3' fontWeight='bold' sx={{ marginBottom: '1.5rem' }}>
                {t(
                  'section_battery.solving_heat_issues_during_high_voltage_charging_enhances_safety'
                )}
              </Typography>
            </S.DescriptionPart>
            <S.DescriptionPart>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ marginBottom: '3rem', fontSize: '1.5rem' }}>
                {t('section_battery.overwhelming_driving_range')}
              </Typography>
              <Typography variant='h3' fontWeight='bold' sx={{ marginBottom: '0.5rem' }}>
                {t('section_battery.the_driving_range_on_a_single_charge_is_104km')}
              </Typography>
              <Typography variant='h5' sx={{ marginBottom: '1.5rem' }}>
                {t('section_battery.environmental_ministry_testing_method_standards_CSV_40')}
              </Typography>
              <Typography variant='h3' fontWeight='bold' sx={{ marginBottom: '0.5rem' }}>
                {t(
                  'section_battery.with_a_72V_60Ah_battery_a_constant_speed_of_60km_h_allows_for_a_range_of_158km'
                )}
              </Typography>
              <Typography variant='h5' sx={{ marginBottom: '1.5rem' }}>
                {t('section_battery.internal_test_results')}
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
            {t(
              'section_bms.compatible_with_direct_parallel_connection_through_in_house_design_patent_pending'
            )}
          </Typography>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            {t(
              'section_bms.designed_to_allow_separate_installation_of_a_1M_battery_without_communication_issues_worlds_first_patent_pending'
            )}
          </Typography>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
            {t(
              'section_bms.designed_for_separate_installation_of_the_battery_to_ensure_safety_can_be_separated_from_1M_and_above'
            )}
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
                sx={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {t('section_mcu.basic')}
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {t(
                  'section_mcu.settings_for_daily_life_or_commuting_including_speed_and_power_uphill_force'
                )}
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {t(
                  'section_mcu.efficient_energy_utilization_combined_with_appropriate_speed_and_output'
                )}
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {t('section_mcu.a_mode_optimized_for_overall_driving_range_based_on_these_factors')}
              </Typography>
            </>
          )}
          {mode === 'delivery' && (
            <>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {t('section_mcu.delivery')}
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {t('section_mcu.livelihood_oriented_user_settings')}
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {t('section_mcu.raise_energy_efficiency_to_the_maximum')}
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {t('section_mcu.minimize_charging_cycles_and_enable_longer_usage')}
              </Typography>
            </>
          )}
          {mode === 'touring' && (
            <>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
                {t('section_mcu.touring')}
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {t('section_mcu.user_settings_for_enjoying_touring')}
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {t('section_mcu.amplify_the_power_of_the_motor_to_the_maximum')}
              </Typography>
              <Typography
                variant='h2'
                fontWeight='bold'
                sx={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>
                {t('section_mcu.delivers_enjoyment_to_users_who_seek_high_speed_driving')}
              </Typography>
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
            sx={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
            {t('section_motor.faster_and_more_powerful_motor')}
          </Typography>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
            {t('section_motor.faster_and_more_powerful_self_designed_in_wheel_motor')}
          </Typography>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
            {t('section_motor.maximum_speed_100km_h')}
          </Typography>
          <Typography sx={{ fontSize: '1rem' }}>
            <strong>·</strong> {t('section_motor.d_company_72v_45ah_maximum_speed_90km_h')}
          </Typography>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
            {t('section_motor.excellent_uphill_force')}
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
            sx={{ fontSize: '2rem', marginBottom: '1.5rem' }}>
            {t('section_regenrative_braking.efficient_energy_usage')}
          </Typography>
          <Typography
            variant='h2'
            fontWeight='bold'
            sx={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
            {t('section_regenrative_braking.the_more_you_drive_the_more_charging_energy')}
          </Typography>
          <Typography sx={{ fontSize: '1rem' }}>
            <strong>·</strong>{' '}
            {t(
              'section_regenrative_braking.total_30_percent_energy_efficiency_increase_through_regenerative_braking_function'
            )}
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
            sx={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
            {t('section_user_review.title1')}
          </Typography>
          <Typography sx={{ fontSize: '1rem' }}>{t('section_user_review.content1')}</Typography>
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
            sx={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
            {t('section_user_review.title2')}
          </Typography>
          <Typography sx={{ fontSize: '1rem' }}>{t('section_user_review.content2')}</Typography>
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
            sx={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
            {t('section_user_review.title3')}
          </Typography>
          <Typography sx={{ fontSize: '1rem' }}>{t('section_user_review.content3')}</Typography>
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
            sx={{ fontSize: '1rem', marginBottom: '0.5rem' }}>
            {t('section_user_review.title4')}
          </Typography>
          <Typography sx={{ fontSize: '1rem' }}>{t('section_user_review.content4')}</Typography>
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
            {t('section_detail.vehicle_specifications')}
          </Typography>
          <S.DetailContentSection>
            <S.DetailContentSectionArea>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>{t('section_detail.engine_type')}</S.DetailContentTitle>
                <S.DetailContentDescription>
                  {t('section_detail.liquid_cooled_in_line_4_cylinder_supercharger')}
                </S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>{t('section_detail.displacement')}</S.DetailContentTitle>
                <S.DetailContentDescription>998cc</S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>{t('section_detail.compression_ratio')}</S.DetailContentTitle>
                <S.DetailContentDescription>11.2 : 1</S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>
                  {t('section_detail.maximum_power_output')}
                </S.DetailContentTitle>
                <S.DetailContentDescription>200ps (147.1kW) / 11,000rpm</S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>{t('section_detail.maximum_torque')}</S.DetailContentTitle>
                <S.DetailContentDescription>
                  137.0Nm (14.0kgf.m) / 8,500rpm
                </S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>{t('section_detail.seat_height')}</S.DetailContentTitle>
                <S.DetailContentDescription>830mm</S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>
                  {t('section_detail.fuel_tank_capacity')}
                </S.DetailContentTitle>
                <S.DetailContentDescription>19 liters</S.DetailContentDescription>
              </S.DetailContentFlexBox>
            </S.DetailContentSectionArea>
            <S.DetailContentSectionArea>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>{t('section_detail.brake')}</S.DetailContentTitle>
                <S.DetailContentDescription>
                  {t(
                    'section_detail.front_320mm_dual_semi_floating_disc_brembo_steel_braided_caliper'
                  )}
                  <br />
                  {t('section_detail.rear_260mm_single_disc_single_piston_caliper')}
                </S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>{t('section_detail.suspension')}</S.DetailContentTitle>
                <S.DetailContentDescription>
                  {t('section_detail.front_43mm_kecs_electronic_full_adjustable_inverted_fork')}
                  <br />
                  {t(
                    'section_detail.rear_horizontal_backlink_kecs_electronic_full_adjustable_shock_absorber'
                  )}
                </S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>{t('section_detail.tire')}</S.DetailContentTitle>
                <S.DetailContentDescription>
                  {t('section_detail.front_120_70zr17m_c_58w')}
                  <br />
                  {t('section_detail.rear_190_55zr17m_c_75w')}
                </S.DetailContentDescription>
              </S.DetailContentFlexBox>
              <S.DetailContentFlexBox>
                <S.DetailContentTitle>{t('section_detail.vehicle_weight')}</S.DetailContentTitle>
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
