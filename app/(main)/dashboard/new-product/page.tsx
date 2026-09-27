"use client";

import { useEffect } from "react";
import { useAtomValue } from "jotai";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import BackLink from "@/components/back-link";
import ProductForm from "@/components/product-form";
import ProductPreview from "@/components/product-preview";
import ProductCreated from "@/components/product-created";
import { productCreatedAtom } from "@/store/atoms/product-created";

export default function NewProduct() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session?.user && status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [session?.user, status, router]);

  const isProductCreated = useAtomValue(productCreatedAtom);

  if (isProductCreated) {
    return <ProductCreated />;
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <BackLink />

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-zinc-950">
        New product
      </h1>
      <p className="mt-1.5 text-[15px] text-zinc-600">
        Set up the page your customers see when they open your link.
      </p>

      <div className="mt-8 grid items-start gap-4 lg:grid-cols-2">
        <ProductForm />
        <ProductPreview />
      </div>
    </main>
  );
}
