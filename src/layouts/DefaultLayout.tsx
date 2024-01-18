import { useEffect } from 'react';
import { Outlet, useNavigate, useSearchParams } from 'react-router-dom';

import * as S from './DefaultLayout.styles';

import { SectionType } from '@/3ds';
import logoImage from '@/assets/images/logo.png';
import { SWImage, Speedometer } from '@/components';
import { PATH } from '@/constants';
import { useIIIDMStore } from '@/stores';

const DefaultLayout: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { sectionType, setSectionType, setSectionProgress } = useIIIDMStore();

  const onLogoClick = () => {
    navigate(PATH.home);
  };

  useEffect(() => {
    const routeSectionType = searchParams.get('section');

    if (routeSectionType && routeSectionType !== sectionType) {
      setSectionType(routeSectionType as SectionType);
      setSectionProgress(0);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams]);

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
