"use client";

import axios from "axios";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { MouseEvent, useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { newProductAtom } from "@/store/atoms/new-product";
import { productCreatedAtom } from "@/store/atoms/product-created";

export default function ProductCreated() {
  const router = useRouter();
  const [link, setLink] = useState("");
  const [copy, setCopy] = useState("Copy to clipboard");
  const newProduct = useRecoilValue(newProductAtom);
  const setIsProductCreated = useSetRecoilState(productCreatedAtom);

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
    <main className="flex min-h-[80svh] items-center justify-center">
      <section className="flex w-[80svw] flex-col items-center gap-2 rounded-lg border p-5 text-center sm:w-[60svw] md:w-[50svw] lg:w-[40svw] xl:w-[30svw]">
        <p className="text-lg font-semibold">
          Created {newProduct.name} &#x1F973;
        </p>

        <p className="text-sm text-neutral-400">
          Below is the link to get feedbacks from customers:
        </p>

        <p className="break-all text-xs sm:text-sm">{link}</p>

        <Button
          className="w-full text-base text-neutral-400"
          variant="link"
          type="button"
          onClick={handleCopyToClipboard}
        >
          {copy}
        </Button>

        <Button
          className="w-[90%]"
          variant="destructive"
          type="button"
          onClick={handleClose}
        >
          Close
        </Button>
      </section>
    </main>
  );
}
