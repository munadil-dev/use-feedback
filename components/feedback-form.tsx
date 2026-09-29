"use client";

import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { SubmitEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "@/components/star-rating";
import { ratingAtom } from "@/store/atoms/rating";
import { newFeedbackSchema } from "@/schemas/new-feedback";

import "@uploadcare/react-uploader/core.css";
const FileUploaderRegular = dynamic(
  () =>
    import("@uploadcare/react-uploader").then((mod) => mod.FileUploaderRegular),
  { ssr: false }
);

type Field = "message" | "customerName" | "customerEmail";
type FieldErrors = Partial<Record<Field, string>>;

const fieldIds: Record<Field, string> = {
  message: "message",
  customerName: "name",
  customerEmail: "email",
};

function FieldError({ field, error }: { field: Field; error?: string }) {
  if (!error) return null;

  return (
    <p
      id={`${fieldIds[field]}-error`}
      className="-mt-2 mb-3 text-sm text-red-500"
    >
      {error}
    </p>
  );
}

const invalidProps = (field: Field, error?: string) => ({
  "aria-invalid": error ? true : undefined,
  "aria-describedby": error ? `${fieldIds[field]}-error` : undefined,
});

interface ProductProps {
  id: string;
  title: string;
  message: string;
}

export default function FeedbackForm({
  productDetails,
}: {
  productDetails: ProductProps;
}) {
  const router = useRouter();
  const rating = useAtomValue(ratingAtom);
  const [message, setMessage] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerImage, setCustomerImage] = useState("");
  const [imageName, setImageName] = useState("");
  const [errors, setErrors] = useState<FieldErrors>({});

  const clearError = (field: Field) =>
    setErrors((prev) => ({ ...prev, [field]: undefined }));

  const handleFeedbackSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();

    const feedback = {
      id: productDetails.id,
      message,
      customerName,
      customerEmail,
      customerImage,
      rating,
    };
    const result = newFeedbackSchema.safeParse(feedback);

    if (!result.success) {
      const fieldErrors: FieldErrors = {};

      for (const issue of result.error.issues) {
        const field = issue.path[0] as Field;
        fieldErrors[field] ??= issue.message;
      }

      setErrors(fieldErrors);

      const firstInvalid = (Object.keys(fieldIds) as Field[]).find(
        (field) => fieldErrors[field]
      );
      if (firstInvalid) {
        document.getElementById(fieldIds[firstInvalid])?.focus();
      }
      return;
    }

    setErrors({});
    const toastId = toast.loading("Loading...");

    try {
      const res = await axios.post("/api/feedback", feedback);

      if (res.data.success) {
        toast.dismiss(toastId);
        toast.success(res.data.message);
        router.push(`${productDetails.id}/submitted`);
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
    <main className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center px-5 py-12">
      <section className="shadow-card-raised w-full max-w-lg rounded-2xl border border-zinc-200 bg-white p-6 sm:p-8">
        <h1 className="text-center text-2xl font-semibold tracking-tight break-words text-zinc-950 sm:text-3xl">
          {productDetails.title}
        </h1>

        <p className="mt-2 mb-6 text-center text-[15px] break-words text-zinc-600">
          {productDetails.message}
        </p>

        <form onSubmit={handleFeedbackSubmit} noValidate>
          <Label htmlFor="message">Message</Label>
          <Textarea
            className="mt-1.5 mb-3 resize-none aria-invalid:border-red-500"
            id="message"
            value={message}
            onChange={(e) => {
              setMessage(e.target.value);
              clearError("message");
            }}
            {...invalidProps("message", errors.message)}
          />
          <FieldError field="message" error={errors.message} />

          <Label htmlFor="name">Your name</Label>
          <Input
            className="mt-1.5 mb-3 aria-invalid:border-red-500"
            id="name"
            value={customerName}
            onChange={(e) => {
              setCustomerName(e.target.value);
              clearError("customerName");
            }}
            {...invalidProps("customerName", errors.customerName)}
          />
          <FieldError field="customerName" error={errors.customerName} />

          <Label htmlFor="email">Your email</Label>
          <Input
            className="mt-1.5 mb-3 aria-invalid:border-red-500"
            id="email"
            type="email"
            value={customerEmail}
            onChange={(e) => {
              setCustomerEmail(e.target.value);
              clearError("customerEmail");
            }}
            {...invalidProps("customerEmail", errors.customerEmail)}
          />
          <FieldError field="customerEmail" error={errors.customerEmail} />

          <Label className="block" htmlFor="photo">
            Upload your photo
          </Label>
          <FileUploaderRegular
            pubkey="bcfc6ab51fbdad37a21b"
            maxLocalFileSizeBytes={10000000}
            multiple={false}
            imgOnly={true}
            sourceList="local, camera"
            useCloudImageEditor={false}
            classNameUploader="my-config"
            className="my-2 mr-3 inline-block"
            onFileUploadSuccess={(e) => {
              setCustomerImage(e.cdnUrl);
              setImageName(e.name);
            }}
          />
          <span className="text-sm text-zinc-600">{imageName}</span>

          <Label className="mt-2 block" id="rating-label">
            Rate
          </Label>
          <StarRating labelledBy="rating-label" />

          <Button className="mt-6 h-11 w-full" type="submit">
            Submit feedback
          </Button>
        </form>
      </section>
    </main>
  );
}
