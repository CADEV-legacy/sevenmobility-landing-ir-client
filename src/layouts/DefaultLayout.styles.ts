import { styled } from '@mui/material';

export const DefaultLayoutContainer = styled('main')({
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: '#000000',
  color: '#FFFFFF',
});

export const DefaultLayoutHeader = styled('header')({
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
