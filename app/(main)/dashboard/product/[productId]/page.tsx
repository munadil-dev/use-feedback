import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import BackLink from "@/components/back-link";
import { notFound, redirect } from "next/navigation";
import FeedbackList from "@/components/feedback-list";
import ProductAnalytics from "@/components/product-analytics";
import { ProductActions, ShareSection } from "@/components/product-overview";

export default async function Product({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
  const session = await auth();
  const code = `<div id="embed-feedbacks"></div>
<script src="${process.env.NEXT_PUBLIC_BASE_URL}api/embed-feedbacks?productId=${productId}"></script>`;

  if (!session?.user?.id) {
    redirect("/auth/signin");
  }

  const productDetails = await prisma.product.findFirst({
    where: {
      id: productId,
    },
    select: {
      userId: true,
      name: true,
      feedbacks: {
        orderBy: { createdAt: "desc" },
      },
      views: {
        where: {
          date: { gte: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000) },
        },
        select: { date: true, count: true },
      },
    },
  });

  if (!productDetails) {
    notFound();
  }

  if (session.user.id != productDetails.userId) {
    redirect("/");
  }

  const productFeedbackURL = `${process.env.NEXT_PUBLIC_BASE_URL}${productId}`;

  const hasFeedback = productDetails.feedbacks.length > 0;

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <BackLink />

      <header className="mt-4 flex flex-wrap items-end justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-3xl font-semibold tracking-[-0.03em] wrap-anywhere text-zinc-950">
            {productDetails.name}
          </h1>

          <p className="mt-1.5 text-[15px] text-zinc-600">
            {hasFeedback
              ? "Heart the replies you want on your site."
              : "Share your link to collect the first reply."}
          </p>
        </div>

        <ProductActions url={productFeedbackURL} />
      </header>

      <div className="mt-8 flex flex-col gap-4">
        <ProductAnalytics
          views={productDetails.views}
          feedbacks={productDetails.feedbacks}
        />

        <ShareSection
          url={productFeedbackURL}
          code={code}
          defaultOpen={!hasFeedback}
        />
      </div>

      <FeedbackList feedbacks={productDetails.feedbacks} />
    </main>
  );
}
