import { createTheme } from '@mui/material';

import { COLOR } from '@/constants';

export const theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 640,
      md: 900,
      lg: 1280,
      xl: 1536,
    },
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        ':root': {
          fontFamily: 'Noto Sans, Noto Sans KR',
          fontSize: '1rem',
          fontWeight: '400',
          fontSynthesis: 'none',
          textRendering: 'optimizeLegibility',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
          WebkitTextSizeAdjust: '100%',
        },
        html: {
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          color: COLOR.white,
          backgroundColor: COLOR.black,
        },
        body: {
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          color: COLOR.white,
          backgroundColor: COLOR.black,
        },
        '#root': {
          width: '100%',
          height: '100%',
        },
      },
    },
  },
  typography: {
    fontFamily: ['Noto Sans', 'Noto Sans KR'].join(','),
    fontSize: 14,
    fontWeightLight: 300,
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700,
    h1: {
      fontSize: '2rem',
      fontWeight: '400',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: '400',
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: '400',
    },
    h4: {
      fontSize: '1rem',
      fontWeight: '400',
    },
    h5: {
      fontSize: '.875rem',
      fontWeight: '400',
    },
    h6: {
      fontSize: '.75rem',
      fontWeight: '400',
    },
  },
});
