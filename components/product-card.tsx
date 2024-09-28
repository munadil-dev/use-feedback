"use client";

import { toast } from "sonner";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
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
} from "@/components/ui/alert-dialog";

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

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <p>&#8226;&#8226;&#8226;</p>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="center">
          <DropdownMenuItem
            className="cursor-pointer"
            onClick={() => router.push(`/dashboard/product/${id}`)}
          >
            View
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer"
            onClick={(e) => e.stopPropagation()}
            onSelect={(e) => e.preventDefault()}
          >
            <DeleteAlert productId={id} />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function DeleteAlert({ productId }: { productId: string }) {
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
    <AlertDialog>
      <AlertDialogTrigger className="w-full text-start">
        Delete
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            product and remove the data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>

        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleDelete}
            className="bg-red-700 text-white hover:bg-red-600"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
