import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function BackLink() {
  return (
    <Link
      href="/dashboard"
      className="focus-visible:ring-primary inline-flex items-center gap-1 rounded-md text-sm font-medium text-zinc-500 transition-colors hover:text-zinc-950 focus-visible:ring-2 focus-visible:outline-hidden"
    >
      <ArrowLeft className="size-4" />
      Products
    </Link>
  );
}
