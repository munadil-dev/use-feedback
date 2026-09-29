import Link from "next/link";
import prisma from "@/lib/db";
import { Plus } from "lucide-react";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import NoProducts from "@/components/no-products";
import StatsBar from "@/components/stats-bar";
import ProductCard from "@/components/product-card";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { formatRating } from "@/lib/feedback-stats";

function NewProductLink({ className }: { className?: string }) {
  return (
    <Link
      className={cn(buttonVariants(), className)}
      href="/dashboard/new-product"
    >
      <Plus className="size-4" />
      New product
    </Link>
  );
}

export default async function Dashboard() {
  const session = await auth();

  if (!session?.user) {
    redirect("/auth/signin");
  }

  const ownedFeedback = { product: { userId: session.user.id } };

  const [products, ratings, favorites] = await Promise.all([
    prisma.product.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        name: true,
        title: true,
        message: true,
        _count: {
          select: { feedbacks: true },
        },
        feedbacks: {
          select: { message: true },
          orderBy: { createdAt: "desc" },
          take: 1,
        },
      },
    }),

    prisma.feedback.groupBy({
      by: ["productId"],
      where: ownedFeedback,
      _avg: { rating: true },
    }),

    prisma.feedback.groupBy({
      by: ["productId"],
      where: { ...ownedFeedback, isFavorite: true },
      _count: { _all: true },
    }),
  ]);

  const cards = products.map((product) => ({
    id: product.id,
    name: product.name,
    title: product.title,
    message: product.message,
    responses: product._count.feedbacks,
    averageRating:
      ratings.find((rating) => rating.productId === product.id)?._avg.rating ??
      0,
    onSite:
      favorites.find((favorite) => favorite.productId === product.id)?._count
        ._all ?? 0,
    latestMessage: product.feedbacks[0]?.message,
  }));

  const responses = cards.reduce((sum, card) => sum + card.responses, 0);

  const overallRating = responses
    ? cards.reduce(
        (sum, card) => sum + card.averageRating * card.responses,
        0
      ) / responses
    : 0;

  return (
    <main className="mx-auto max-w-6xl px-5 py-12">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-semibold tracking-[-0.03em] text-zinc-950">
            Products
          </h1>
          <p className="mt-1.5 text-[15px] text-zinc-600">
            Each product has its own feedback link and widget.
          </p>
        </div>

        <NewProductLink />
      </header>

      {products.length === 0 ? (
        <NoProducts className="mt-8">
          <NewProductLink className="mt-8 bg-white text-zinc-950 hover:bg-zinc-100" />
        </NoProducts>
      ) : (
        <>
          <StatsBar
            className="mt-8"
            stats={[
              { label: "Responses", value: responses },
              {
                label: "Average rating",
                value: formatRating(overallRating),
              },
              {
                label: "On your sites",
                value: cards.reduce((sum, card) => sum + card.onSite, 0),
              },
            ]}
          />

          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <li key={card.id}>
                <ProductCard details={card} />
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
