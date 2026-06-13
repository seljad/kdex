"use client";
import { NextUIProvider } from "@nextui-org/react";
import { ReactNode } from "react";
import ContextProviderWagmi from "@/components/hoc/ContextProviderWagmi";

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ContextProviderWagmi>
      <NextUIProvider>
        {children}
      </NextUIProvider>
    </ContextProviderWagmi>
  );
}