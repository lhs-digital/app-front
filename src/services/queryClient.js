import { QueryClient } from "@tanstack/react-query";

export const qc = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnMount: true,
      refetchOnReconnect: true,
      refetchOnWindowFocus: true,
      retry: true,
      staleTime: 1000 * 60 * 2,
    },
  },
});
