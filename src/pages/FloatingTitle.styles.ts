import { styled } from '@mui/material';

export const FloatingTitleContainer = styled('div')<{
  top?: string;
  right?: string;
  bottom?: string;
  left?: string;
  isFloatingDescriptionVisible: boolean;
}>(({ top, right, bottom, left, isFloatingDescriptionVisible }) => ({
  position: 'fixed',
  zIndex: 2,
  left: left ?? 'unset',
  right: right ?? 'unset',
  top: top ? (isFloatingDescriptionVisible ? top : '-100%') : 'unset',
  bottom: bottom ? (isFloatingDescriptionVisible ? bottom : '-100%') : 'unset',
  transition: 'all 1s ease-in-out',
  WebkitTransition: 'all 1s ease-in-out',
  MozTransition: 'all 1s ease-in-out',
  display: 'flex',
  flexDirection: 'column',
  fontSize: '4rem',
  fontWeight: 'bold',
  overflow: 'hidden',
}));
