import prisma from "@/lib/db";
import { notFound } from "next/navigation";
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
  });

  if (!productDetails) {
    notFound();
  }

  return <FeedbackForm productDetails={productDetails} />;
}
