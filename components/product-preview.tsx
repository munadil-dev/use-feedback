"use client";

import { newProductAtom } from "@/store/atoms/new-product";
import { useAtomValue } from "jotai";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Button } from "./ui/button";

export default function ProductPreview() {
  const newProduct = useAtomValue(newProductAtom);

  return (
    <article className="relative flex w-full flex-col gap-3 rounded-md border bg-white p-6 shadow-md lg:w-[90%] xl:w-[70%] dark:shadow-neutral-900">
      <p className="absolute -top-3 w-fit rounded-full bg-green-400 px-2 py-1 text-xs font-semibold text-green-900">
        Live preview
      </p>

      <p className="text-center text-xl font-semibold">{newProduct.title}</p>

      <p className="mb-3 text-center text-sm text-neutral-400">
        {newProduct.message}
      </p>

      <Label>Message</Label>
      <Input className="h-16" disabled />

      <Label>Your name</Label>
      <Input disabled />

      <Label>Your email</Label>
      <Input disabled />

      <Label>Upload your photo</Label>
      <Input type="file" disabled />

      <Button className="w-full" disabled>
        Submit feedback
      </Button>
    </article>
  );
}
