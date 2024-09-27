"use client";

import { useRouter } from "next/navigation";
import { ExternalLink } from "lucide-react";

interface ProductCardProps {
  id: string;
  name: string;
  feedbacks: Array<{ id: string }>;
}

export default function ProductCard({
  details: { id, name, feedbacks },
}: {
  details: ProductCardProps;
}) {
  const router = useRouter();

  return (
    <div
      className="flex cursor-pointer items-center justify-between rounded-md bg-zinc-200 p-3 hover:bg-zinc-300 dark:bg-zinc-900 dark:hover:bg-zinc-800"
      onClick={() => router.push(`/dashboard/product/${id}`)}
    >
      <div className="flex flex-col gap-1">
        <p className="text-lg font-medium">{name}</p>

        <p className="text-sm font-medium text-neutral-500 dark:text-neutral-400">
          Total feedbacks: {feedbacks.length}
        </p>
      </div>

      <ExternalLink className="w-5" />
    </div>
  );
}
