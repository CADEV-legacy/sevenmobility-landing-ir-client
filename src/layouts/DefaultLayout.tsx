import { useTranslation } from 'react-i18next';
import { Outlet, useNavigate } from 'react-router-dom';

import { FormControl, NativeSelect, Typography } from '@mui/material';
import { useSnackbar } from 'notistack';

import * as S from './DefaultLayout.styles';

import logoImage from '@/assets/images/logo.png';
import { SWImage } from '@/components';
import { PATH } from '@/constants';
import { useIIIDMStore } from '@/stores';

const LANGUAGES = ['en', 'ko', 'vn'];

const DefaultLayout: React.FC = () => {
  const { i18n } = useTranslation();
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

  const onLanguageChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const language = event.target.value;

    if (LANGUAGES.includes(language)) {
      i18n.changeLanguage(language);
    }
  };

  return (
    <S.DefaultLayoutContainer>
      <S.DefaultLayoutHeader>
        <S.Logo onClick={onLogoClick}>
          <SWImage alt='nav-logo' src={logoImage} />
        </S.Logo>
        <S.LanguageSelectorContainer>
          <Typography variant='h4'>Language</Typography>
          <FormControl sx={{ m: 1 }} variant='standard'>
            <NativeSelect
              id='demo-customized-select-native'
              value={i18n.language}
              onChange={onLanguageChange}
              input={<S.BootstrapInput />}>
              <option value={'en'}>EN</option>
              <option value={'ko'}>KO</option>
              <option value={'vn'}>VN</option>
            </NativeSelect>
          </FormControl>
        </S.LanguageSelectorContainer>
      </S.DefaultLayoutHeader>
      <Outlet />
    </S.DefaultLayoutContainer>
  );
};

export default DefaultLayout;
