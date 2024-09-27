import prisma from "@/lib/db";
import { notFound } from "next/navigation";
import FeedbackForm from "@/components/feedback-form";

interface FeedbackPageProps {
  params: {
    productId: string;
  };
}

export default async function FeedbackPage({ params }: FeedbackPageProps) {
  const productDetails = await prisma.product.findUnique({
    where: {
      id: params.productId,
    },
  });

  if (!productDetails) {
    notFound();
  }

  return <FeedbackForm productDetails={productDetails} />;
}
