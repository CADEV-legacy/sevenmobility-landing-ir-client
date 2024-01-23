import DoneOutlineIcon from '@mui/icons-material/DoneOutline';
import { Typography } from '@mui/material';

import * as S from './FloatingSpecDescription.styles';

type FloatingSpecDescriptionProps = { isVisible: boolean };

export const FloatingSpecDescription: React.FC<FloatingSpecDescriptionProps> = ({ isVisible }) => {
  return (
    <S.FloatingSpecDescriptionContainer isFloatingDescriptionVisible={isVisible}>
      <Typography variant='h2' fontWeight='bold' sx={{ marginBottom: '3rem', fontSize: '3rem' }}>
        SM1
      </Typography>
      <Typography variant='h2' sx={{ marginBottom: '1.5rem' }}>
        <DoneOutlineIcon sx={{ marginRight: '1rem' }} />
        주행 거리 <strong>158km</strong>
      </Typography>
      <Typography variant='h2' sx={{ marginBottom: '1.5rem' }}>
        <DoneOutlineIcon sx={{ marginRight: '1rem' }} />
        최고 속도 <strong>100km/h</strong>
      </Typography>
      <Typography variant='h2'>
        <DoneOutlineIcon sx={{ marginRight: '1rem' }} />
        모터 출력 <strong>7kW</strong>
      </Typography>
    </S.FloatingSpecDescriptionContainer>
  );
};
