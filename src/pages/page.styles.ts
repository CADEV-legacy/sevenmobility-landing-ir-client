import { styled } from '@mui/material';

export const Container = styled('section')({
  position: 'relative',
  width: '100%',
  height: '100%',
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
  // marginBottom: '30rem',
  boxSizing: 'border-box',
  opacity: opacityScore,
}));
