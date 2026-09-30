import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import TrackView from "@/components/track-view";
import FeedbackForm from "@/components/feedback-form";

interface FeedbackPageProps {
  params: Promise<{
    productId: string;
  }>;
}

export default async function FeedbackPage({ params }: FeedbackPageProps) {
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

      <FeedbackForm productDetails={productDetails} />
    </>
  );
}
