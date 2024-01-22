import { CssBaseline, ThemeProvider } from '@mui/material';
import { SnackbarProvider } from 'notistack';

import { CustomNotistackWithInfo, CustomNotistackWithError } from '@/components/customNotistack';
import { theme } from '@/themes';

type ProviderProps = {
  children: React.ReactNode;
};

export const Provider: React.FC<ProviderProps> = ({ children }) => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider
        maxSnack={3}
        Components={{ default: CustomNotistackWithInfo, error: CustomNotistackWithError }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        autoHideDuration={1500}>
        {children}
      </SnackbarProvider>
    </ThemeProvider>
  );
};
