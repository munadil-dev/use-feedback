"use client";

import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import dynamic from "next/dynamic";
import { useAtomValue } from "jotai";
import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import StarRating from "@/components/star-rating";
import { ratingAtom } from "@/store/atoms/rating";

import "@uploadcare/react-uploader/core.css";
const FileUploaderRegular = dynamic(
  () =>
    import("@uploadcare/react-uploader").then((mod) => mod.FileUploaderRegular),
  { ssr: false }
);

interface ProductProps {
  id: string;
  name: string;
  title: string;
  message: string;
  userId: string;
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

  const handleFeedbackSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Loading...");

    try {
      const res = await axios.post("/api/feedback/create", {
        id: productDetails.id,
        message,
        customerName,
        customerEmail,
        customerImage,
        rating,
      });

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
    <main className="flex min-h-[90svh] items-center justify-center">
      <section className="flex w-[80vw] flex-col gap-4 py-4 sm:w-[65vw] md:w-[50vw] lg:w-[45vw] xl:w-[40vw]">
        <h1 className="text-center text-4xl font-semibold">
          {productDetails.title}
        </h1>

        <p className="text-center text-sm text-neutral-400">
          {productDetails.message}
        </p>

        <form onSubmit={handleFeedbackSubmit}>
          <Label htmlFor="message">Message</Label>
          <Textarea
            className="mb-3 resize-none"
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />

          <Label htmlFor="name">Your name</Label>
          <Input
            className="mb-3"
            id="name"
            value={customerName}
            onChange={(e) => setCustomerName(e.target.value)}
          />

          <Label htmlFor="email">Your email</Label>
          <Input
            className="mb-3"
            id="email"
            value={customerEmail}
            onChange={(e) => setCustomerEmail(e.target.value)}
          />

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
          <span>{imageName}</span>

          <Label className="mt-2 block">Rate</Label>
          <StarRating />

          <Button className="mt-5 w-full" type="submit">
            Submit feedback
          </Button>
        </form>
      </section>
    </main>
  );
}
