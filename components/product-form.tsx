"use client";

import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { SubmitEvent } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useAtom, useSetAtom } from "jotai";
import { newProductAtom } from "@/store/atoms/new-product";
import { productCreatedAtom } from "@/store/atoms/product-created";

export default function ProductForm() {
  const [newProduct, setNewProduct] = useAtom(newProductAtom);
  const setIsProductCreated = useSetAtom(productCreatedAtom);

  const handleSubmit = async (e: SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const toastId = toast.loading("Loading...");

    try {
      const res = await axios.post("/api/product/create-product", newProduct);

      if (res.data.success) {
        toast.dismiss(toastId);
        toast.success(res.data.message);
        setIsProductCreated(true);
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
    <article className="shadow-card rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <h2 className="mb-5 font-semibold tracking-tight text-zinc-950">
        Details
      </h2>

      <form onSubmit={handleSubmit}>
        <Label htmlFor="product-name">Product name</Label>
        <Input
          className="mt-1.5 mb-4"
          id="product-name"
          placeholder="Blog App"
          type="text"
          onChange={(e) =>
            setNewProduct((val) => ({ ...val, name: e.target.value }))
          }
        />

        <Label htmlFor="title">Title</Label>
        <Input
          className="mt-1.5 mb-4"
          id="title"
          placeholder="Blog App review"
          type="text"
          onChange={(e) =>
            setNewProduct((val) => ({ ...val, title: e.target.value }))
          }
        />

        <Label htmlFor="message">Custom message</Label>
        <Textarea
          className="mt-1.5 mb-4 resize-none"
          id="message"
          placeholder="Review my blog app which has ..."
          onChange={(e) =>
            setNewProduct((val) => ({ ...val, message: e.target.value }))
          }
        />

        <Button className="mt-2 w-full" type="submit">
          Create product
        </Button>
      </form>
    </article>
  );
}
