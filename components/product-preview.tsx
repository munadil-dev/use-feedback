"use client";

import Image from "next/image";
import { Fragment } from "react";
import { useAtomValue } from "jotai";
import { Upload } from "lucide-react";
import { newProductAtom } from "@/store/atoms/new-product";
import { previewFields } from "@/lib/constant/product.constant";
import skyImage from "@/public/sky.jpg";
import { Label } from "./ui/label";
import { Stars } from "./home/stars";
import { WindowDots } from "./home/window-dots";

export default function ProductPreview() {
  const newProduct = useAtomValue(newProductAtom);

  return (
    <section
      aria-label="Preview"
      className="relative isolate overflow-hidden rounded-3xl px-4 py-8 shadow-[0_40px_80px_-40px_rgba(31,62,181,0.55)] sm:px-10 sm:py-12 lg:sticky lg:top-20"
    >
      <Image
        src={skyImage}
        alt=""
        fill
        placeholder="blur"
        sizes="(min-width: 1024px) 55vw, 100vw"
        className="-z-10 object-cover"
      />

      <p className="text-center text-sm font-medium text-white/90">
        Live preview of what customers see
      </p>

      <div className="mx-auto mt-5 max-w-md overflow-hidden rounded-xl border border-white/60 bg-white shadow-[0_1px_2px_rgba(20,30,90,0.2),0_32px_64px_-24px_rgba(20,30,90,0.6)]">
        <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-2.5">
          <WindowDots />
          <span className="text-xs text-zinc-500">vouch.munadil.com</span>
        </div>

        <div aria-hidden="true" className="flex flex-col gap-3 bg-zinc-50 p-6">
          <p className="text-center text-xl font-semibold tracking-tight wrap-anywhere text-zinc-950">
            {newProduct.title || "Your page title"}
          </p>

          <p className="mb-2 text-center text-sm wrap-anywhere text-zinc-600">
            {newProduct.message || "Your message to customers"}
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
      </div>
    </section>
  );
}
