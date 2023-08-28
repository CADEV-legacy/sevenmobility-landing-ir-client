import { Outlet } from 'react-router-dom';

import * as S from './DefaultLayout.styles';

const DefaultLayout: React.FC = () => {
  return (
    <S.DefaultLayoutContainer>
      <S.Header></S.Header>
      <Outlet />
      <S.Footer></S.Footer>
    </S.DefaultLayoutContainer>
  );
};

export default DefaultLayout;
