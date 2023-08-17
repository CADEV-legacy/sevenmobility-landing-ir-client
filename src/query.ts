import { QueryClient } from '@tanstack/react-query';

import { TIME_FORMAT } from '@/constants';

export const client = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      retryDelay: TIME_FORMAT.seconds(2),
      staleTime: TIME_FORMAT.seconds(5),
      cacheTime: TIME_FORMAT.minutes(30),
      refetchOnWindowFocus: false,
      refetchOnMount: true,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: 1,
      retryDelay: TIME_FORMAT.seconds(2),
      cacheTime: TIME_FORMAT.minutes(30),
    },
  },
});
