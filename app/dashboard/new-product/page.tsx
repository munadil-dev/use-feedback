"use client";

import { useEffect } from "react";
import { useAtomValue } from "jotai";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
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
    <main className="mb-6 flex min-h-[85dvh] items-start justify-center pt-4 sm:mb-2">
      <section className="mt-10 grid w-[90svw] grid-cols-1 gap-12 rounded-md border bg-white/50 p-6 shadow-md sm:w-[70svw] lg:grid-cols-2 lg:gap-6 xl:gap-0">
        <ProductPreview />
        <ProductForm />
      </section>
    </main>
  );
}
