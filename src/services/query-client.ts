
import { QueryClient } from '@tanstack/react-query';
import { QUERY_CACHE_TIME, QUERY_STALE_TIME } from '@/config/app-config';

// Configure the QueryClient with our app settings
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      gcTime: QUERY_CACHE_TIME,
      staleTime: QUERY_STALE_TIME,
      refetchOnWindowFocus: false,
      retry: 1
    }
  }
});
