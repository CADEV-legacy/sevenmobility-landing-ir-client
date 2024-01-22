import { forwardRef } from 'react';

import ErrorIcon from '@mui/icons-material/Error';
import { Typography } from '@mui/material';
import { SnackbarKey, SnackbarMessage } from 'notistack';

import * as S from './CustomNotistackWithError.styles';

type CustomNotistackWithErrorProps = {
  id: SnackbarKey;
  message: SnackbarMessage;
};

export const CustomNotistackWithError = forwardRef<HTMLDivElement, CustomNotistackWithErrorProps>(
  ({ id, message }, ref) => (
    <S.CustomNotistackWithErrorContainer key={`custom-notistack-with-error-${id}`} ref={ref}>
      <ErrorIcon color='error' />
      <Typography>{message}</Typography>
    </S.CustomNotistackWithErrorContainer>
  )
);

CustomNotistackWithError.displayName = 'CustomNotistackWithError';
