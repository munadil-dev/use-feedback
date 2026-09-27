import Link from "next/link";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";

export default function NotFound() {
  return (
    <main className="flex min-h-[calc(100svh-3.5rem)] flex-col items-center justify-center px-5 py-12 text-center">
      <p className="text-primary text-sm font-medium">404</p>
      <h1 className="mt-2 text-4xl font-semibold tracking-[-0.03em] text-balance text-zinc-950 sm:text-5xl">
        Page not found
      </h1>
      <p className="mt-3 text-[15px] text-zinc-600">
        The link may be wrong, or the page was removed.
      </p>
      <Link className={cn(buttonVariants({ size: "lg" }), "mt-8")} href="/">
        Go back home
      </Link>
    </main>
  );
}
