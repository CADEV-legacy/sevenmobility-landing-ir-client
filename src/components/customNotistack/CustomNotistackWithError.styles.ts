import { styled } from '@mui/material';

import { COLOR } from '@/constants';

export const CustomNotistackWithErrorContainer = styled('div')(({ theme }) => ({
  display: 'flex',
  gap: '1rem',
  minWidth: '40rem',
  maxWidth: '62.5rem',
  height: '4.25rem',
  border: `.0625rem solid ${COLOR.systemError}`,
  boxShadow: `.25rem .25rem 0 0 ${COLOR.systemError}`,
  backgroundColor: COLOR.black,
  color: COLOR.white,
  borderRadius: '.125rem',
  padding: '1.5rem 2rem',
  boxSizing: 'border-box',
  fontWeight: '500',
  lineHeight: '1.25rem',
  letterSpacing: '.0313rem',
  [theme.breakpoints.down('md')]: {
    minWidth: 'unset',
    maxWidth: 'unset',
    width: '100%',
    height: 'auto',
    padding: '1rem 1.5rem',
  },
  '& .MuiTypography-root': {
    [theme.breakpoints.down('md')]: {
      fontSize: '0.75rem !important',
    },
  },
}));
