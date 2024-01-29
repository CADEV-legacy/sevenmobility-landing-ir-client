import { InputBase, styled } from '@mui/material';

import { COLOR } from '@/constants';

export const DefaultLayoutContainer = styled('main')({
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: '#000000',
  color: '#FFFFFF',
});

export const DefaultLayoutHeader = styled('header')({
  position: 'fixed',
  top: 0,
  left: 0,
  zIndex: 2,
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  width: '100%',
  height: '6rem',
  padding: '0 2rem',
});

export const Logo = styled('div')({
  position: 'relative',
  width: '3rem',
  height: '3rem',
  cursor: 'pointer',
});

export const LanguageSelectorContainer = styled('div')({
  display: 'flex',
  gap: '1rem',
  alignItems: 'center',
});

export const BootstrapInput = styled(InputBase)(({ theme }) => ({
  'label + &': {
    marginTop: theme.spacing(3),
  },
  '& .MuiInputBase-input': {
    position: 'relative',
    borderRadius: '.25rem',
    color: COLOR.white,
    border: '1px solid #ced4da',
    fontSize: 16,
    padding: '10px 26px 10px 12px',
    transition: theme.transitions.create(['border-color', 'box-shadow']),
    // Use the system font instead of the default Roboto font.
    '&:focus': {
      borderRadius: 4,
      borderColor: '#80bdff',
      boxShadow: '0 0 0 0.2rem rgba(0,123,255,.25)',
    },
  },
  '& .MuiSvgIcon-root': {
    color: COLOR.white,
  },
}));
