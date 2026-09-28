"use client";

import { useSyncExternalStore } from "react";
import { cn } from "@/lib/utils";

function subscribe(onChange: () => void) {
  window.addEventListener("scroll", onChange, { passive: true });
  return () => window.removeEventListener("scroll", onChange);
}

export default function NavbarShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const scrolled = useSyncExternalStore(
    subscribe,
    () => window.scrollY > 8,
    () => false
  );

  return (
    <header
      className={cn(
        "sticky top-0 left-0 z-50 border-b transition-[background-color,border-color] duration-200",
        scrolled
          ? "border-zinc-200/70 bg-white/80 backdrop-blur-md"
          : "border-transparent"
      )}
    >
      {children}
    </header>
  );
}
