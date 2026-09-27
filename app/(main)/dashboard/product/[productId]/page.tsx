import Link from "next/link";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import BackLink from "@/components/back-link";
import EmptyState from "@/components/empty-state";
import CodeComponent from "@/components/code";
import { notFound, redirect } from "next/navigation";
import FeedbackCard from "@/components/feedback-card";

function Panel({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="shadow-card rounded-2xl border border-zinc-200 bg-white p-5 sm:p-6">
      <h2 className="font-semibold tracking-tight text-zinc-950">{title}</h2>
      <p className="mt-1 text-sm text-zinc-600">{description}</p>
      {children}
    </section>
  );
}

export default async function Product({
  params,
}: {
  params: Promise<{ productId: string }>;
}) {
  const { productId } = await params;
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

  const favorites = productDetails.feedbacks.filter(
    (feedback) => feedback.isFavorite
  ).length;

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <BackLink />

      <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-zinc-950">
        {productDetails.name}
      </h1>

      <div className="mt-8 grid gap-4 lg:grid-cols-2">
        <Panel
          title="Feedback link"
          description="Send this to customers so they can leave feedback."
        >
          <Link
            className="mt-4 block rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 font-mono text-[13px] break-all text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-950"
            href={productFeedbackURL}
            target="_blank"
          >
            {productFeedbackURL}
          </Link>
        </Panel>

        <Panel
          title="Website widget"
          description="Paste this where your favorites should appear."
        >
          <CodeComponent code={code} />
        </Panel>
      </div>

      <header className="mt-12 flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
          Feedback
        </h2>
        <p className="text-sm text-zinc-500 tabular-nums">
          {favorites} of {productDetails.feedbacks.length} on your site
        </p>
      </header>

      {productDetails.feedbacks.length === 0 ? (
        <EmptyState
          title="No feedback yet"
          body="Responses show up here as soon as customers send them."
          className="mt-4"
        />
      ) : (
        <ul className="mt-4 grid gap-4 md:grid-cols-2">
          {productDetails.feedbacks.map((feedback) => (
            <li key={feedback.id}>
              <FeedbackCard feedback={feedback} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
