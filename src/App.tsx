import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Provider } from '@/components';
import { PATH } from '@/constants';
import { AuthLayout, DefaultLayout } from '@/layouts';
import { AuthSignInPage, AuthSignUpPage, HomePage } from '@/pages';

function App() {
  return (
    <Provider>
      <Suspense>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path={PATH.home} element={<HomePage />} />
          </Route>
          <Route element={<AuthLayout />}>
            <Route path={PATH.authSignIn} element={<AuthSignInPage />} />
            <Route path={PATH.authSignUp} element={<AuthSignUpPage />} />
          </Route>
        </Routes>
      </Suspense>
    </Provider>
  );
}

export default App;
