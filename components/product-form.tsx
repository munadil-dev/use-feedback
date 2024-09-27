"use client";

import axios, { AxiosError } from "axios";
import { toast } from "sonner";
import { FormEvent } from "react";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";
import { Textarea } from "./ui/textarea";
import { useRecoilState, useSetRecoilState } from "recoil";
import { newProductAtom } from "@/store/atoms/new-product";
import { productCreatedAtom } from "@/store/atoms/product-created";

export default function ProductForm() {
  const [newProduct, setNewProduct] = useRecoilState(newProductAtom);
  const setIsProductCreated = useSetRecoilState(productCreatedAtom);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
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
    <article className="flex flex-col gap-8">
      <h1 className="text-center text-xl font-semibold">
        Create a new Feedback page
      </h1>

      <form onSubmit={handleSubmit}>
        <Label htmlFor="product-name">Product name</Label>
        <Input
          className="mb-4"
          id="product-name"
          placeholder="Blog App"
          type="text"
          onChange={(e) =>
            setNewProduct((val) => ({ ...val, name: e.target.value }))
          }
        />

        <Label htmlFor="title">Title</Label>
        <Input
          className="mb-4"
          id="title"
          placeholder="Blog App review"
          type="text"
          onChange={(e) =>
            setNewProduct((val) => ({ ...val, title: e.target.value }))
          }
        />

        <Label htmlFor="message">Custom message</Label>
        <Textarea
          className="mb-4 resize-none"
          id="message"
          placeholder="Review my blog app which has ..."
          onChange={(e) =>
            setNewProduct((val) => ({ ...val, message: e.target.value }))
          }
        />

        <Button className="mt-4 w-full" type="submit">
          Create
        </Button>
      </form>
    </article>
  );
}
