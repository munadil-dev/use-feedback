"use client";

import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Avatar } from "./home/avatar";
import { Stars } from "./home/stars";
import { HeartButton } from "./home/interactive";
import DeleteDialog from "./delete-dialog";

interface FeedbackProps {
  feedback: {
    id: string;
    message: string;
    customerName: string;
    customerEmail: string;
    rating: number;
    createdAt: Date;
  };
  isFavorite: boolean;
  onFavoriteChange: (isFavorite: boolean) => void;
}

export default function FeedbackCard({
  feedback,
  isFavorite,
  onFavoriteChange,
}: FeedbackProps) {
  const createdAt = new Date(feedback.createdAt);

  const updateFavorite = async () => {
    const newFavorite = !isFavorite;
    const toastId = toast.loading("Updating...");

    try {
      const res = await axios.post("/api/feedback/favorite", {
        feedbackId: feedback.id,
        isFavorite: newFavorite,
      });

      if (res.data.success) {
        toast.dismiss(toastId);
        onFavoriteChange(newFavorite);
        toast.success(res.data.message);
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
    <article className="shadow-card flex h-full flex-col rounded-2xl border border-zinc-200 bg-white p-5">
      <header className="flex items-center justify-between gap-3">
        <Stars count={feedback.rating} size="sm" />

        <time
          dateTime={createdAt.toISOString()}
          className="text-xs text-zinc-500"
        >
          {createdAt.toLocaleDateString("en-us", {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </time>
      </header>

      <p className="mt-3 flex-1 text-[15px] leading-6 break-words text-zinc-800">
        {feedback.message}
      </p>

      <footer className="mt-5 flex items-center gap-3 border-t border-zinc-100 pt-4">
        <Avatar name={feedback.customerName} size="md" />

        <p className="flex min-w-0 flex-1 flex-col text-sm">
          <span className="truncate font-medium text-zinc-950">
            {feedback.customerName}
          </span>

          <span className="truncate text-xs text-zinc-500">
            {feedback.customerEmail}
          </span>
        </p>

        <HeartButton
          pressed={isFavorite}
          onToggle={updateFavorite}
          label={`Show ${feedback.customerName}'s feedback on your site`}
        />

        <DeleteFeedbackAlert feedbackId={feedback.id} />
      </footer>
    </article>
  );
}

function DeleteFeedbackAlert({ feedbackId }: { feedbackId: string }) {
  const router = useRouter();

  const removeFeedback = async () => {
    const toastId = toast.loading("Removing...");

    try {
      const res = await axios.post("/api/feedback/remove", {
        feedbackId,
      });

      if (res.data.success) {
        toast.dismiss(toastId);
        toast.error(res.data.message);
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
      description="This action cannot be undone. This will permanently delete the feedback from the product and remove it from our servers."
      onConfirm={removeFeedback}
      triggerLabel="Delete feedback"
      triggerClassName="-mr-1.5 flex shrink-0 size-8 cursor-pointer items-center justify-center rounded-md text-zinc-400 transition-colors hover:bg-red-50 hover:text-red-600 focus-visible:ring-2 focus-visible:ring-primary focus-visible:outline-hidden"
    >
      <Trash2 className="size-4" />
    </DeleteDialog>
  );
}
