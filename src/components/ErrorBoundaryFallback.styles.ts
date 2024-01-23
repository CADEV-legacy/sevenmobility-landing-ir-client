import { Button, styled } from '@mui/material';

import { COLOR } from '@/constants';

export const ErrorBoundaryFallbackContainer = styled('main')({
  width: '100%',
  height: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
});

export const ErrorBoundaryHeader = styled('header')({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2,
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '6rem',
  padding: '0 2rem',
});

export const Logo = styled('div')({
  position: 'relative',
  width: '3rem',
  height: '3rem',
  cursor: 'pointer',
});

export const ErrorMessageContainer = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  width: '40rem',
  height: '50rem',
  padding: '3rem 2rem',
  boxSizing: 'border-box',
  borderRadius: '.5rem',
  border: `.125rem solid ${COLOR.white}`,
});

export const ErrorResetButton = styled(Button)({
  width: '100%',
  height: '3rem',
  backgroundColor: COLOR.white,
  color: COLOR.black,
  fontWeight: '700',
  '&:hover': {
    backgroundColor: COLOR.grayScale80,
  },
});
