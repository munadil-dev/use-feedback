"use client";

import { newProductAtom } from "@/store/atoms/new-product";
import { Fragment } from "react";
import { useAtomValue } from "jotai";
import { Upload } from "lucide-react";
import { previewFields } from "@/lib/constant/product.constant";
import { Label } from "./ui/label";
import { Stars } from "./home/stars";
import { WindowDots } from "./home/window-dots";

export default function ProductPreview() {
  const newProduct = useAtomValue(newProductAtom);

  return (
    <section
      aria-label="Preview"
      className="shadow-card-raised overflow-hidden rounded-2xl border border-zinc-200 bg-white"
    >
      <header className="flex items-center gap-3 border-b border-zinc-200 px-5 py-3">
        <WindowDots />
        <p className="text-xs text-zinc-500">Preview of your feedback page</p>
      </header>

      <div aria-hidden="true" className="flex flex-col gap-3 bg-zinc-50 p-6">
        <p className="text-center text-xl font-semibold tracking-tight break-words text-zinc-950">
          {newProduct.title || "Your title"}
        </p>
        <p className="mb-2 text-center text-sm break-words text-zinc-600">
          {newProduct.message || "Your custom message"}
        </p>

        {previewFields.map(({ label, height }) => (
          <Fragment key={label}>
            <Label>{label}</Label>
            <div
              className={`${height} rounded-md border border-zinc-200 bg-white`}
            />
          </Fragment>
        ))}
        <Label>Upload your photo</Label>
        <div className="flex h-8 w-fit items-center gap-2 rounded-md bg-zinc-900 px-3 text-sm text-white">
          <Upload className="size-4" />
          Upload file
        </div>
        <Label>Rate</Label>
        <Stars count={5} />
        <div className="bg-primary mt-2 flex h-10 items-center justify-center rounded-lg text-sm font-medium text-white">
          Submit feedback
        </div>
      </div>
    </section>
  );
}
