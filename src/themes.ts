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
          color: COLOR.font,
          backgroundColor: COLOR.background,
        },
        body: {
          width: '100%',
          height: '100%',
          margin: 0,
          padding: 0,
          color: COLOR.font,
          backgroundColor: COLOR.background,
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
      fontSize: '1.5rem',
      fontWeight: '700',
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: '700',
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: '700',
    },
    h4: {
      fontSize: '1.5rem',
      fontWeight: '700',
    },
    h5: {
      fontSize: '1.5rem',
      fontWeight: '700',
    },
    h6: {
      fontSize: '1.5rem',
      fontWeight: '700',
    },
  },
});
