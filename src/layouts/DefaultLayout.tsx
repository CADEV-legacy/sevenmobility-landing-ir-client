import { Outlet, useNavigate } from 'react-router-dom';

import * as S from './DefaultLayout.styles';

import logoImage from '@/assets/images/logo.png';
import { SWImage, Speedometer } from '@/components';
import { PATH } from '@/constants';

const DefaultLayout: React.FC = () => {
  const navigate = useNavigate();

  const onLogoClick = () => {
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
