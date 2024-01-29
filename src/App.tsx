import { Suspense } from 'react';
import { ErrorBoundary } from 'react-error-boundary';
import { Route, Routes } from 'react-router-dom';

import { ErrorBoundaryFallback, Provider } from '@/components';
import { PATH } from '@/constants';
import { DefaultLayout } from '@/layouts';
import '@/locales/i18n';
import { HomePage } from '@/pages';

function App() {
  return (
    <Provider>
      <Suspense>
        <ErrorBoundary FallbackComponent={ErrorBoundaryFallback}>
          <Routes>
            <Route element={<DefaultLayout />}>
              <Route path={PATH.home} element={<HomePage />} />
            </Route>
          </Routes>
        </ErrorBoundary>
      </Suspense>
    </Provider>
  );
}

export default App;
