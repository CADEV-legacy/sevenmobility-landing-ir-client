import { Outlet, useNavigate } from 'react-router-dom';

import { useSnackbar } from 'notistack';

import * as S from './DefaultLayout.styles';

import logoImage from '@/assets/images/logo.png';
import { SWImage, Speedometer } from '@/components';
import { PATH } from '@/constants';
import { useIIIDMStore } from '@/stores';

const DefaultLayout: React.FC = () => {
  const navigate = useNavigate();
  const { section } = useIIIDMStore();
  const { enqueueSnackbar } = useSnackbar();

  const onLogoClick = () => {
    if (section === 'loading') {
      enqueueSnackbar('로딩 중에는 URL을 이동할 수 없습니다.');

      return;
    }

    navigate(PATH.home);
  };

  return (
    <S.DefaultLayoutContainer>
      <S.DefaultLayoutHeader>
        <S.Logo onClick={onLogoClick}>
          <SWImage alt='nav-logo' src={logoImage} />
        </S.Logo>
      </S.DefaultLayoutHeader>
      <S.DefaultLayoutFloatingSpeedometerContainer>
        <Speedometer />
      </S.DefaultLayoutFloatingSpeedometerContainer>
      <Outlet />
    </S.DefaultLayoutContainer>
  );
};

export default DefaultLayout;
