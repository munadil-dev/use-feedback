"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import SuccessIcon from "@/components/success-icon";
import { MouseEvent, useEffect, useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { newProductAtom } from "@/store/atoms/new-product";
import { productCreatedAtom } from "@/store/atoms/product-created";

export default function ProductCreated() {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [copy, setCopy] = useState("Copy link");
  const newProduct = useAtomValue(newProductAtom);
  const setIsProductCreated = useSetAtom(productCreatedAtom);

  const handleCopyToClipboard = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    navigator.clipboard.writeText(link);
    setCopy("Copied!");
  };

  const handleClose = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setIsProductCreated(false);
    router.push("/dashboard");
  };

  useEffect(() => {
    const fetchProductId = async () => {
      try {
        const res = await axios.post("/api/product/get-product-id", {
          name: newProduct.name,
        });

        const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;

        if (res.data.success) {
          setLink(`${baseUrl}${res.data.id}`);
        }
      } catch (err) {
        console.error(err);
      }
    };

    if (newProduct.name) {
      fetchProductId();
    }
  }, [newProduct.name]);

  return (
    <main className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center px-5 py-12">
      <section className="shadow-card-raised w-full max-w-md rounded-2xl border border-zinc-200 bg-white p-6 text-center">
        <SuccessIcon />
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-zinc-950">
          {newProduct.name} is ready
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Send this link to customers to collect feedback.
        </p>

        <p className="mt-5 min-h-11 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 font-mono text-[13px] break-all text-zinc-700">
          {link}
        </p>

        <div className="mt-5 grid gap-2 sm:grid-cols-2">
          <Button
            variant="outline"
            type="button"
            onClick={handleCopyToClipboard}
            disabled={!link}
          >
            {copy}
          </Button>
          <Button type="button" onClick={handleClose}>
            Go to dashboard
          </Button>
        </div>
      </section>
    </main>
  );
}
