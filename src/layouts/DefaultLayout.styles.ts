import { Link } from 'react-router-dom';

import { styled } from '@mui/material';

import { COLOR } from '@/constants';

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

export const DefaultLayoutFloatingSpeedometerContainer = styled('div')({
  position: 'fixed',
  zIndex: 2,
  right: '2rem',
  bottom: '2rem',
  width: '20rem',
});

export const NavButtonContainer = styled('div')({
  position: 'absolute',
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  height: '100%',
});

export const NavButton = styled(Link)({
  display: 'block',
  width: '3rem',
  height: '1.5rem',
  backgroundColor: COLOR.grayScale10,
  textDecoration: 'none',
  color: COLOR.white,
  cursor: 'pointer',
});
