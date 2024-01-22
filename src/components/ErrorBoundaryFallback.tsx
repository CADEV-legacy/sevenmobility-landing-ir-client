import { FallbackProps } from 'react-error-boundary';
import { useNavigate } from 'react-router-dom';

import { Typography } from '@mui/material';

import { SWImage } from '.';
import * as S from './ErrorBoundaryFallback.styles';

import logoImage from '@/assets/images/logo.png';
import { PATH } from '@/constants';

export const ErrorBoundaryFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const navigate = useNavigate();

  const onBackToHomeButtonClick = () => {
    resetErrorBoundary();

    navigate(PATH.home);
  };

  return (
    <S.ErrorBoundaryFallbackContainer>
      <S.ErrorBoundaryHeader>
        <S.Logo onClick={onBackToHomeButtonClick}>
          <SWImage alt='nav-logo' src={logoImage} />
        </S.Logo>
      </S.ErrorBoundaryHeader>
      <S.ErrorMessageContainer>
        <Typography fontWeight={'bold'} variant='h1' sx={{ marginBottom: '0.5rem' }}>
          Client Error
        </Typography>
        <Typography variant='h4' sx={{ marginBottom: '3rem' }}>
          에러가 발생했습니다. 다시 시도하시려면 아래 버튼을 클릭 해 주세요.
        </Typography>
        <Typography fontWeight={'bold'} variant='h3' sx={{ marginBottom: '0.5rem' }}>
          Error Message
        </Typography>
        <Typography variant='h3' sx={{ marginBottom: '6rem' }}>
          {error.message}
        </Typography>
        <S.ErrorResetButton onClick={onBackToHomeButtonClick}>Reset</S.ErrorResetButton>
      </S.ErrorMessageContainer>
    </S.ErrorBoundaryFallbackContainer>
  );
};
