import { cache } from "react";
import prisma from "@/lib/db";
import type { Metadata, ResolvingMetadata } from "next";
import { notFound } from "next/navigation";
import TrackView from "@/components/track-view";
import ReviewForm from "@/components/review-form";

interface ReviewPageProps {
  params: Promise<{
    productId: string;
  }>;
}

// Shared by the page and its metadata, so the product is loaded once per request.
const getProduct = cache((id: string) =>
  prisma.product.findUnique({
    where: { id },
    select: { id: true, title: true, message: true },
  })
);

export async function generateMetadata(
  { params }: ReviewPageProps,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const product = await getProduct((await params).productId);

  if (!product) return { robots: { index: false } };

  return {
    title: { absolute: product.title },
    description: product.message,
    robots: { index: false },
    openGraph: {
      title: product.title,
      description: product.message,
      images: (await parent).openGraph?.images,
    },
  };
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { productId } = await params;
  const productDetails = await getProduct(productId);

  if (!productDetails) {
    notFound();
  }

  return (
    <>
      <TrackView productId={productDetails.id} />

      <ReviewForm productDetails={productDetails} />
    </>
  );
}
