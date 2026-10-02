"use client";

import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Avatar } from "./home/avatar";
import { Stars } from "./home/stars";
import { HeartButton } from "./home/interactive";
import DeleteDialog from "./delete-dialog";

interface ReviewProps {
  review: {
    id: string;
    message: string;
    customerName: string;
    customerEmail: string;
    customerImage: string | null;
    rating: number;
    createdAt: Date;
  };
  isFavorite: boolean;
  onFavoriteChange: (isFavorite: boolean) => void;
}

export default function ReviewCard({
  review,
  isFavorite,
  onFavoriteChange,
}: ReviewProps) {
  const createdAt = new Date(review.createdAt);

  const saving = useRef(false);

  const toggleFavorite = async () => {
    if (saving.current) return;
    saving.current = true;

    const newFavorite = !isFavorite;
    onFavoriteChange(newFavorite);

    try {
      await axios.patch(`/api/reviews/${review.id}`, {
        isFavorite: newFavorite,
      });
    } catch (err) {
      onFavoriteChange(isFavorite);

      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data?.message ??
            "Could not update the favorite. Try again."
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    } finally {
      saving.current = false;
    }
  };

  return (
    <article className="shadow-card flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5">
      <header className="flex items-center justify-between gap-3">
        <Stars count={review.rating} size="sm" />

        <time
          dateTime={createdAt.toISOString()}
          className="text-xs text-zinc-500"
        >
          {createdAt.toLocaleDateString("en-us", {
            year: "numeric",
            month: "short",
            day: "numeric",
            timeZone: "UTC",
          })}
        </time>
      </header>

      <p className="mt-3 flex-1 text-[15px] leading-6 break-words text-zinc-800">
        {review.message}
      </p>

      <footer className="mt-5 flex items-center gap-3 border-t border-zinc-100 pt-4">
        <CustomerPhoto name={review.customerName} src={review.customerImage} />

        <p className="flex min-w-0 flex-1 flex-col text-sm">
          <span className="truncate font-medium text-zinc-950">
            {review.customerName}
          </span>

          <span className="truncate text-xs text-zinc-500">
            {review.customerEmail}
          </span>
        </p>

        <HeartButton
          pressed={isFavorite}
          onToggle={toggleFavorite}
          label={`Show ${review.customerName}'s review on your site`}
        />

        <DeleteReviewAlert reviewId={review.id} />
      </footer>
    </article>
  );
}

function CustomerPhoto({ name, src }: { name: string; src: string | null }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <Avatar name={name} size="md" />;
  }

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
      className="size-9 shrink-0 rounded-lg bg-zinc-100 object-cover"
    />
  );
}

function DeleteReviewAlert({ reviewId }: { reviewId: string }) {
  const router = useRouter();

  const removeReview = async () => {
    const toastId = toast.loading("Removing...");

    try {
      const res = await axios.delete(`/api/reviews/${reviewId}`);

      if (res.data.success) {
        toast.dismiss(toastId);
        toast.success(res.data.message);
        router.refresh();
      }
    } catch (err) {
      toast.dismiss(toastId);

      if (err instanceof AxiosError) {
        toast.error(
          err.response?.data?.message ??
            "Could not delete the review. Try again."
        );
      } else {
        toast.error("An unexpected error occurred");
      }
    }
  };

  return (
    <DeleteDialog
      description="This action cannot be undone. This will permanently delete the review from the product and remove it from our servers."
      onConfirm={removeReview}
      triggerLabel="Delete review"
      triggerClassName="-mr-1.5 flex shrink-0 size-8 cursor-pointer items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
    >
      <Trash2 className="size-4" />
    </DeleteDialog>
  );
}
