import { styled } from '@mui/material';

export const FloatingSpecDescriptionContainer = styled('div')<{
  isFloatingDescriptionVisible: boolean;
}>(({ isFloatingDescriptionVisible }) => ({
  position: 'fixed',
  zIndex: 2,
  right: isFloatingDescriptionVisible ? '6%' : '-100%',
  top: '30%',
  transition: 'all 1.5s ease-in-out',
  WebkitTransition: 'all 1.5s ease-in-out',
  MozTransition: 'all 1.5s ease-in-out',
  display: 'flex',
  width: '30rem',
  flexDirection: 'column',
  overflow: 'hidden',
}));
