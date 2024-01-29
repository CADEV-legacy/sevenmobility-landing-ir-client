import { styled } from '@mui/material';

export const MCUStatusPentagramContainer = styled('div')({
  position: 'relative',
  width: '100%',
  height: '100%',
});

export const MCUSpeedStatusText = styled('div')({
  position: 'absolute',
  top: '-14%',
  left: 0,
  width: '100%',
});

export const MCURPMStatusText = styled('div')({
  position: 'absolute',
  top: '30%',
  right: '-22%',
});

export const MCUDistanceDrivenStatusText = styled('div')({
  position: 'absolute',
  bottom: '-9%',
  right: '8%',
});

export const MCUEnergyEfficiencyStatusText = styled('div')({
  position: 'absolute',
  bottom: '-9%',
  left: '-4%',
});

export const MCUPowerStatusText = styled('div')({
  position: 'absolute',
  top: '28%',
  left: '-24%',
});

export const StatusPentagramSVGContainer = styled('div')({
  '.st0': {
    fill: '#FFFFFF',
    fillOpacity: 0.2,
    stroke: '#FFFFFF',
    strokeWidth: 3,
    strokeMiterlimit: 10,
  },
  '.st1': {
    fill: 'none',
    stroke: '#C7C7C7',
    strokeMiterlimit: 10,
  },
  '.st2': {
    fill: 'none',
    strokeWidth: 5,
  },
  '#active-mcu-pentagram': {
    transition: 'all 0.5s',
  },
});
