import Link from "next/link";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { ArrowLeft } from "lucide-react";
import CodeComponent from "@/components/code";
import * as motion from "framer-motion/client";
import { Button } from "@/components/ui/button";
import { notFound, redirect } from "next/navigation";
import FeedbackCard from "@/components/feedback-card";

export default async function Product({
  params: { productId },
}: {
  params: { productId: string };
}) {
  const session = await auth();
  const code = `<div id="embed-feedbacks"></div>
<script src="${process.env.NEXT_PUBLIC_BASE_URL}api/embed-feedbacks?productId=${productId}"></script>`;

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const productDetails = await prisma.product.findFirst({
    where: {
      id: productId,
    },
    select: {
      userId: true,
      name: true,
      feedbacks: true,
    },
  });

  if (!productDetails) {
    notFound();
  }

  if (session.user.id != productDetails.userId) {
    redirect("/");
  }

  const productFeedbackURL = `${process.env.NEXT_PUBLIC_BASE_URL}${productId}`;

  return (
    <main className="flex min-h-[80svh] justify-center p-8">
      <section className="container mx-auto flex w-[90vw] flex-col gap-8 sm:w-[70vw] md:w-[60vw]">
        <Link href="/dashboard">
          <Button className="flex items-center gap-1">
            <ArrowLeft className="w-4" />
            Back
          </Button>
        </Link>

        <div className="flex flex-col gap-2">
          <h1 className="text-3xl font-semibold">{productDetails.name}</h1>

          <p className="text-[0.84rem] text-neutral-500 dark:text-neutral-400 sm:text-sm">
            Feedback URL:{" "}
            <Link
              className="break-all underline hover:text-neutral-800 dark:hover:text-neutral-200"
              href={productFeedbackURL}
              target="_blank"
            >
              {productFeedbackURL}
            </Link>
          </p>
        </div>

        <CodeComponent code={code} />

        <p className="text-xl font-medium">Feedback</p>

        <motion.article
          className="flex flex-col gap-5"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            type: "spring",
            damping: 10,
            stiffness: 100,
          }}
        >
          {productDetails.feedbacks.length === 0 && (
            <p className="text-center font-medium text-neutral-400">
              No feedback recieved yet.
            </p>
          )}

          {productDetails.feedbacks.map((feedback) => {
            return <FeedbackCard key={feedback.id} feedback={feedback} />;
          })}
        </motion.article>
      </section>
    </main>
  );
}
