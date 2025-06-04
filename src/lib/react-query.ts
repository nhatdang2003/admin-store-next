import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Tắt refetch khi focus window
      retry: 1, // Số lần retry khi request fail
      staleTime: 5 * 60 * 1000, // Data được coi là stale sau 5 phút
    },
  },
});
