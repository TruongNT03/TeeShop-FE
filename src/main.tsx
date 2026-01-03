import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/sonner";
import { ThemeProvider } from "next-themes";
import { PermissionsProvider } from "@/contexts/PermissionsContext";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <PermissionsProvider>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <App />
        <ReactQueryDevtools initialIsOpen />
        <Toaster richColors position="top-right" />
      </ThemeProvider>
    </PermissionsProvider>
  </QueryClientProvider>
  // </StrictMode>
);
