"use client";

import { toast } from "sonner";
import { useState } from "react";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Star, Heart, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface FeedbackProps {
  feedback: {
    id: string;
    message: string;
    customerName: string;
    customerEmail: string;
    rating: number;
    createdAt: Date;
    isFavorite: boolean;
  };
}

export default function FeedbackCard({ feedback }: FeedbackProps) {
  const [isFavorite, setIsFavorite] = useState<boolean>(feedback.isFavorite);

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
        setIsFavorite(newFavorite);
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
    <div className="flex flex-col gap-2 rounded-lg bg-neutral-100 px-6 py-6 dark:bg-zinc-900">
      <div className="flex justify-between">
        <div className="flex items-center gap-1">
          {Array.from({ length: feedback.rating }, (_, index) => {
            return (
              <Star key={index} className="fill-current text-yellow-400" />
            );
          })}
        </div>

        <div className="flex items-center gap-4">
          {isFavorite ? (
            <Heart
              className="cursor-pointer fill-red-600"
              onClick={updateFavorite}
            ></Heart>
          ) : (
            <Heart className="cursor-pointer" onClick={updateFavorite} />
          )}

          <DeleteFeedbackAlert feedbackId={feedback.id} />
        </div>
      </div>

      <p className="font-medium text-neutral-500 dark:text-neutral-400">
        {feedback.message}
      </p>

      <div className="flex w-full items-center">
        <div className="w-1/2">
          <p className="font-medium">Name</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {feedback.customerName}
          </p>
        </div>

        <div className="w-1/2">
          <p className="font-medium">Email</p>
          <p className="text-sm text-neutral-500 dark:text-neutral-400">
            {feedback.customerEmail}
          </p>
        </div>
      </div>

      <div>
        <p className="font-medium">Submitted at</p>
        <p className="text-sm text-neutral-500 dark:text-neutral-400">
          {new Date(feedback.createdAt).toLocaleString("en-us", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "numeric",
            minute: "numeric",
            second: "numeric",
          })}
        </p>
      </div>
    </div>
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
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Trash2 className="cursor-pointer" />
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            feedback from the product and remove it from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={removeFeedback}
            className="bg-red-700 text-white hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
