import { styled } from '@mui/material';

export const FloatingBatteryDescriptionContainer = styled('div')<{
  isFloatingDescriptionVisible: boolean;
}>(({ isFloatingDescriptionVisible }) => ({
  position: 'fixed',
  zIndex: 2,
  left: isFloatingDescriptionVisible ? '10%' : '-100%',
  bottom: '6%',
  transition: 'all 1s ease-in-out',
  WebkitTransition: 'all 1s ease-in-out',
  MozTransition: 'all 1s ease-in-out',
  display: 'flex',
  flexDirection: 'column',
  gap: '3rem',
  width: '60%',
  overflow: 'hidden',
}));

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
