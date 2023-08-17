import { Outlet } from 'react-router-dom';

import * as S from './DefaultLayout.styles';

const DefaultLayout: React.FC = () => {
  return (
    <S.DefaultLayoutContainer>
      <Outlet />
    </S.DefaultLayoutContainer>
  );
};

export default DefaultLayout;
