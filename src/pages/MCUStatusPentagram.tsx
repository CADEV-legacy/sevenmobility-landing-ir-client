import { useEffect, useMemo } from 'react';

import { Typography } from '@mui/material';

import * as S from './MCUStatusPentagram.styles';

import { MCUModeProps, MCU_MODE, MCU_MODE_MAP, useMCUModeStore } from '@/stores';

export const MCUStatusPentagram: React.FC = () => {
  const { mode, setMode } = useMCUModeStore();

  const activeMCUModeProps = useMemo(() => MCU_MODE_MAP[mode], [mode]);

  useEffect(() => {
    const changeMCUModeInterval = setInterval(() => {
      const activeMCUModeIndex = MCU_MODE.indexOf(mode);

      if (activeMCUModeIndex === MCU_MODE.length - 1) setMode(MCU_MODE[0]);
      else setMode(MCU_MODE[activeMCUModeIndex + 1]);
    }, 3000);

    return () => {
      clearInterval(changeMCUModeInterval);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode]);

  return (
    <S.MCUStatusPentagramContainer>
      <StatusPentagramSVG activeMCUModeProps={activeMCUModeProps} />
      <S.MCUSpeedStatusText>
        <Typography variant='h2' textAlign='center'>
          속도
        </Typography>
      </S.MCUSpeedStatusText>
      <S.MCURPMStatusText>
        <Typography variant='h2'>RPM</Typography>
      </S.MCURPMStatusText>
      <S.MCUDistanceDrivenStatusText>
        <Typography variant='h2'>주행거리</Typography>
      </S.MCUDistanceDrivenStatusText>
      <S.MCUEnergyEfficiencyStatusText>
        <Typography variant='h2'>에너지효율</Typography>
      </S.MCUEnergyEfficiencyStatusText>
      <S.MCUPowerStatusText>
        <Typography variant='h2' textAlign='center'>
          힘<br />
          (등판력)
        </Typography>
      </S.MCUPowerStatusText>
    </S.MCUStatusPentagramContainer>
  );
};

type StatusPentagramSVGProps = {
  activeMCUModeProps: MCUModeProps;
};

const StatusPentagramSVG: React.FC<StatusPentagramSVGProps> = ({ activeMCUModeProps }) => {
  return (
    <S.StatusPentagramSVGContainer>
      <svg
        version='1.1'
        id='레이어_1'
        xmlns='http://www.w3.org/2000/svg'
        xlinkHref='http://www.w3.org/1999/xlink'
        x='0px'
        y='0px'
        viewBox='0 0 425 404'
        style={{ background: 'new 0 0 425 404' }}
        xmlSpace='preserve'>
        <path className='st0' d='M212.2,2.7L2.1,155.4l80.3,247h259.8l80.3-247L212.2,2.7z' />
        <path className='st1' d='M212.2,55.3L44,167.8l64.3,182h208l64.3-182L212.2,55.3z' />
        <path className='st1' d='M212.2,104.4l-112.2,75l42.8,121.3h138.7l42.8-121.3L212.2,104.4z' />
        <path className='st1' d='M212.2,148.2l-61.4,41.5l23.4,67.2h75.8l23.4-67.2L212.2,148.2z' />
        <path
          className='st2'
          id='active-mcu-pentagram'
          d={activeMCUModeProps.d}
          stroke={activeMCUModeProps.stroke}
          strokeWidth='5'
        />
      </svg>
    </S.StatusPentagramSVGContainer>
  );
};
