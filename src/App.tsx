import { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';

import { Provider } from '@/components';
import { PATH } from '@/constants';
import { DefaultLayout } from '@/layouts';
import { HomePage } from '@/pages';

function App() {
  return (
    <Provider>
      <Suspense>
        <Routes>
          <Route element={<DefaultLayout />}>
            <Route path={PATH.home} element={<HomePage />} />
          </Route>
        </Routes>
      </Suspense>
    </Provider>
  );
}

export default App;
