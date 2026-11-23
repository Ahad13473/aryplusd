"use client";

import { DirectionProvider } from "@radix-ui/react-direction";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useState, type ReactNode } from "react";
import { Toaster } from "@/components/ui/sonner";

export function Providers({ children, dir = "ltr" }: { children: ReactNode; dir?: "ltr" | "rtl" }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 1000,
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      {/* Radix menus and tabs follow the page direction (RTL for Urdu, Arabic, Pashto, Persian). */}
      <DirectionProvider dir={dir}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          {children}
          <Toaster position={dir === "rtl" ? "top-left" : "top-right"} dir={dir} richColors closeButton />
        </ThemeProvider>
      </DirectionProvider>
    </QueryClientProvider>
  );
}
