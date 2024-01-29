import { styled } from '@mui/material';

export const Container = styled('section')({
  position: 'relative',
  width: '100%',
  height: '100%',
  overflow: 'hidden',
});

export const CanvasWrapper = styled('div')({
  position: 'fixed',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
});

export const LoadProgressOverlay = styled('div')<{ isLoaded: boolean }>(({ isLoaded }) => ({
  display: isLoaded ? 'none' : 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  position: 'absolute',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
}));

export const LoadProgressText = styled('div')({
  fontSize: '3rem',
  fontWeight: 700,
  color: '#FFFFFF',
});

export const Overlay = styled('div')<{ isLoaded: boolean }>(({ isLoaded }) => ({
  position: 'absolute',
  display: isLoaded ? 'flex' : 'none',
  flexDirection: 'column',
  gap: '2rem',
  justifyContent: 'center',
  alignItems: 'center',
  width: '100%',
  height: '100%',
  top: 0,
  left: 0,
}));

export const Title = styled('div')<{ opacityScore: number }>(({ opacityScore }) => ({
  fontSize: '3rem',
  fontWeight: 700,
  color: '#FFFFFF',
  boxSizing: 'border-box',
  opacity: opacityScore,
}));

export const FloatingSpeedmeterContainer = styled('div')({
  position: 'fixed',
  zIndex: 2,
  right: '2rem',
  bottom: '2rem',
  width: '20rem',
});

export const FloatingMCUStatusPentagramContainer = styled('div')({
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  width: '24rem',
  height: '24rem',
  padding: '4rem',
  boxSizing: 'border-box',
});

export const FloatingSpecTitleKRContainer = styled('div')({
  width: '14rem',
  height: '4.75rem',
});

export const FloatingSpecDescriptionContainer = styled('div')({
  display: 'flex',
  width: '30rem',
  flexDirection: 'column',
  gap: '2rem',
  overflow: 'hidden',
});

export const FloatingBatteryTitleKRContainer = styled('div')({
  width: '18rem',
  height: '4.75rem',
});

export const FloatingBatteryDescriptionContainer = styled('div')({
  display: 'flex',
  width: '68rem',
  flexDirection: 'column',
  gap: '2rem',
  overflow: 'hidden',
});

export const BatteryDescriptionKeywordFlexContainer = styled('div')({
  display: 'flex',
  alignItems: 'center',
  gap: '2rem',
  width: '100%',
});

export const BatteryDescriptionKeyWord = styled('div')<{ color: string }>(({ color }) => ({
  padding: '1rem 4rem',
  boxSizing: 'border-box',
  borderRadius: '1rem',
  backgroundColor: color,
}));

export const DescriptionFlexContainer = styled('div')({
  display: 'flex',
  justifyContent: 'space-between',
  width: '100%',
});

export const DescriptionPart = styled('div')({
  width: 'calc(100% / 2 - 2rem)',
});

export const FloatingBMSTitleKRContainer = styled('div')({
  width: '12rem',
  height: '4.75rem',
});

export const FloatingBMSContentContainer = styled('div')({
  display: 'flex',
  width: '68rem',
  flexDirection: 'column',
  gap: '2rem',
  overflow: 'hidden',
});

export const FloatingMCUContentContainer = styled('div')({
  display: 'flex',
  width: '34rem',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '2rem',
  overflow: 'hidden',
});

export const FloatingMotorTitleKRContainer = styled('div')({
  width: '12rem',
  height: '4.75rem',
});

export const FloatingMotorContentContainer = styled('div')({
  display: 'flex',
  width: '36rem',
  flexDirection: 'column',
  alignItems: 'flex-end',
  gap: '1rem',
  overflow: 'hidden',
});

export const FloatingRegenrativeBrakingContentContainer = styled('div')({
  display: 'flex',
  width: '36rem',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '1rem',
  overflow: 'hidden',
});

export const FloatingUserReviewTitleKRContainer = styled('div')({
  width: '12rem',
  height: '4.75rem',
});

export const FloatingUserReviewContentContainer = styled('div')({
  display: 'flex',
  width: '20rem',
  flexDirection: 'column',
  alignItems: 'flex-start',
  gap: '1rem',
  overflow: 'hidden',
});

export const FloatingDetailTitleKRContainer = styled('div')({
  width: '12rem',
  height: '4.75rem',
});

export const FloatingDetailContentContainer = styled('div')({
  display: 'flex',
  width: '68rem',
  flexDirection: 'column',
  gap: '1rem',
  overflow: 'hidden',
});

export const DetailContentSection = styled('div')({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
});

export const DetailContentSectionArea = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'space-between',
  gap: '1rem',
  width: '50%',
});

export const DetailContentFlexBox = styled('div')({
  width: '100%',
  display: 'flex',
  justifyContent: 'space-between',
});

export const DetailContentTitle = styled('div')({
  width: '20%',
  fontWeight: '700',
});

export const DetailContentDescription = styled('div')({
  width: '70%',
});
