import { styled } from '@mui/material';

// NOTE: Total percentage is 800%
export const SpeedometerContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100%',
});

export const SpeedometerContent = styled('div')({
  display: 'flex',
  flexDirection: 'column',
  position: 'absolute',
  top: '52%',
  left: '35%',
  width: '30%',
});
