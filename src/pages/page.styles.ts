import { styled } from '@mui/material';

export const Container = styled('section')({
  position: 'relative',
  width: '100%',
  height: '100%',
});

export const CanvasWrapper = styled('div')({
  position: 'absolute',
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
