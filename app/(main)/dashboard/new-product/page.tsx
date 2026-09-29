"use client";

import { useEffect } from "react";
import { useAtom } from "jotai";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import BackLink from "@/components/back-link";
import ProductForm from "@/components/product-form";
import ProductPreview from "@/components/product-preview";
import ProductCreated from "@/components/product-created";
import { createdProductAtom } from "@/store/atoms/created-product";

export default function NewProduct() {
  const router = useRouter();
  const { data: session, status } = useSession();

  useEffect(() => {
    if (!session?.user && status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [session?.user, status, router]);

  const [createdProduct, setCreatedProduct] = useAtom(createdProductAtom);

  useEffect(() => {
    return () => setCreatedProduct(null);
  }, [setCreatedProduct]);

  if (createdProduct) {
    return <ProductCreated {...createdProduct} />;
  }

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16">
        <section>
          <BackLink />

          <h1 className="mt-6 text-4xl leading-[1.05] font-semibold tracking-[-0.04em] text-zinc-950">
            New product
          </h1>

          <p className="mt-3 text-[15px] leading-6 text-zinc-600">
            Set up the page customers see when they open your link. You can
            share it as soon as it&apos;s created.
          </p>

          <ProductForm />
        </section>

        <ProductPreview />
      </div>
    </main>
  );
}
