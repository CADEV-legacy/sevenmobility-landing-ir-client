import { Outlet } from 'react-router-dom';

import * as S from './AuthLayout.styles';

const AuthLayout: React.FC = () => {
  return (
    <S.AuthLayoutContainer>
      <Outlet />
    </S.AuthLayoutContainer>
  );
};

export default AuthLayout;
