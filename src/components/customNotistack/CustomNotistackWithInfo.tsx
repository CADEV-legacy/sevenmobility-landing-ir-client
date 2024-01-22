import { forwardRef } from 'react';

import CircleNotificationsIcon from '@mui/icons-material/CircleNotifications';
import { Typography } from '@mui/material';
import { SnackbarKey, SnackbarMessage } from 'notistack';

import * as S from './CustomNotistackWithInfo.styles';

type CustomNotistackWithInfoProps = {
  id: SnackbarKey;
  message: SnackbarMessage;
};

export const CustomNotistackWithInfo = forwardRef<HTMLDivElement, CustomNotistackWithInfoProps>(
  ({ id, message }, ref) => (
    <S.CustomNotistackWithInfoContainer key={`custom-notistack-with-error-${id}`} ref={ref}>
      <CircleNotificationsIcon />
      <Typography>{message}</Typography>
    </S.CustomNotistackWithInfoContainer>
  )
);

CustomNotistackWithInfo.displayName = 'CustomNotistackWithInfo';
