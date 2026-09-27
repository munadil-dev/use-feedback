"use client";

import { ReactNode } from "react";
import { SessionProvider } from "next-auth/react";
import { Provider } from "jotai";

export default function Providers({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <Provider>{children}</Provider>
    </SessionProvider>
  );
}
