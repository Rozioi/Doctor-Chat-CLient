import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";

import { TelegramProvider } from "./app/providers/TelegramProvider";
import { RouterProvider } from "react-router";
import { router } from "./app/routes/router";
import { QueryClientProvider, QueryClient } from "@tanstack/react-query";
import AuthProvider from "./features/auth/context/AuthContext.tsx";
import "./shared/lib/i18n";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      refetchOnMount: false,
      refetchOnReconnect: true,
      retry: 1,
      staleTime: 5 * 60 * 1000,
      gcTime: 10 * 60 * 1000,
    },
    mutations: {
      retry: 1,
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <TelegramProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </TelegramProvider>
    </QueryClientProvider>
  </StrictMode>,
);
