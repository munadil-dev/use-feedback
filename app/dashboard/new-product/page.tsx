"use client";

import { useEffect } from "react";
import { useRecoilValue } from "recoil";
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

  const isProductCreated = useRecoilValue(productCreatedAtom);

  if (isProductCreated) {
    return <ProductCreated />;
  }

  return (
    <main className="mb-6 flex items-center justify-center pt-4 sm:mb-2">
      <section className="grid w-[90svw] grid-cols-1 gap-12 rounded-md border p-6 shadow-md dark:shadow-neutral-900 sm:w-[70svw] lg:grid-cols-2 lg:gap-6 xl:gap-0">
        <ProductPreview />
        <ProductForm />
      </section>
    </main>
  );
}
