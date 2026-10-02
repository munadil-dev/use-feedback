import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import TrackView from "@/components/track-view";
import ReviewForm from "@/components/review-form";

interface ReviewPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function ReviewPage({ params }: ReviewPageProps) {
  const { productId } = await params;

  const productDetails = await prisma.product.findUnique({
    where: {
      id: productId,
    },
    select: { id: true, title: true, message: true },
  });

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
