"use client";

import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import Link from "next/link";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, MoreHorizontal, Star } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import DeleteDialog from "@/components/delete-dialog";
import { formatRating } from "@/lib/feedback-stats";

interface ProductCardProps {
  id: string;
  name: string;
  responses: number;
  averageRating: number;
  onSite: number;
  latestMessage?: string;
}

export default function ProductCard({
  details: { id, name, responses, averageRating, onSite, latestMessage },
}: {
  details: ProductCardProps;
}) {
  const router = useRouter();
  const href = `/dashboard/product/${id}`;
  const [deleteOpen, setDeleteOpen] = useState(false);
  const menuTriggerRef = useRef<HTMLButtonElement>(null);

  return (
    <article className="group shadow-card hover:shadow-card-raised relative flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5 transition-[border-color,box-shadow] duration-150 hover:border-zinc-300">
      <header className="flex items-start justify-between gap-3">
        <span
          aria-hidden="true"
          className="flex size-9 items-center justify-center rounded-lg bg-zinc-950 text-sm font-semibold text-white uppercase"
        >
          {[...name][0]}
        </span>

        <DropdownMenu>
          <DropdownMenuTrigger
            ref={menuTriggerRef}
            aria-label={`Actions for ${name}`}
            className="focus-visible:ring-primary relative z-10 -mt-1 -mr-1 flex size-8 cursor-pointer items-center justify-center rounded-lg text-zinc-500 transition-colors hover:bg-zinc-100 hover:text-zinc-900 focus-visible:ring-2 focus-visible:outline-hidden"
          >
            <MoreHorizontal className="size-4" />
          </DropdownMenuTrigger>

          <DropdownMenuContent align="end">
            <DropdownMenuItem
              className="cursor-pointer"
              onClick={() => router.push(href)}
            >
              View
            </DropdownMenuItem>

            <DropdownMenuItem
              className="cursor-pointer"
              onSelect={() => setDeleteOpen(true)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <DeleteAlert
          productId={id}
          open={deleteOpen}
          onOpenChange={setDeleteOpen}
          returnFocusRef={menuTriggerRef}
        />
      </header>

      <Link
        href={href}
        className="focus-visible:after:ring-primary mt-5 rounded-sm font-semibold tracking-tight wrap-anywhere text-zinc-950 after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-hidden focus-visible:after:ring-2"
      >
        {name}
      </Link>

      <p className="mt-1 flex items-center gap-1.5 text-sm text-zinc-500 tabular-nums">
        {responses} {responses === 1 ? "response" : "responses"}
        {responses > 0 && (
          <>
            <span aria-hidden="true">·</span>

            <Star
              aria-hidden="true"
              className="size-3.5 fill-amber-400 text-amber-400"
            />

            <span>
              {formatRating(averageRating)}
              <span className="sr-only"> average rating</span>
            </span>
          </>
        )}
      </p>

      <p className="mt-4 line-clamp-2 flex-1 text-sm leading-6 text-zinc-600">
        {latestMessage
          ? `“${latestMessage}”`
          : "No replies yet. Share your link to get the first one."}
      </p>

      <footer className="mt-5 flex items-center justify-between border-t border-zinc-100 pt-3 text-xs text-zinc-500 tabular-nums">
        <span>{onSite} on your site</span>

        <ChevronRight
          aria-hidden="true"
          className="size-4 text-zinc-400 transition-transform duration-150 group-hover:translate-x-0.5"
        />
      </footer>
    </article>
  );
}

function DeleteAlert({
  productId,
  open,
  onOpenChange,
  returnFocusRef,
}: {
  productId: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  returnFocusRef: React.RefObject<HTMLButtonElement | null>;
}) {
  const router = useRouter();

  const handleDelete = async () => {
    const toastId = toast.loading("Product getting deleted...");

    try {
      const res = await axios.post("/api/product/delete-product", {
        productId,
      });

      if (res.data.success) {
        toast.dismiss(toastId);
        toast.success(res.data.message);
        router.refresh();
      }
    } catch (err) {
      toast.dismiss(toastId);

      if (err instanceof AxiosError) {
        toast.error(err.response?.data.message);
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <DeleteDialog
      description="This action cannot be undone. This will permanently delete your product and remove the data from our servers."
      onConfirm={handleDelete}
      open={open}
      onOpenChange={onOpenChange}
      returnFocusRef={returnFocusRef}
    />
  );
}
