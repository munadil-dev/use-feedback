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
import { averageRating, formatRating } from "@/lib/feedback-stats";

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

  const products = await prisma.product.findMany({
    where: {
      userId: session.user.id,
    },
    select: {
      id: true,
      name: true,
      feedbacks: {
        select: {
          id: true,
          rating: true,
          message: true,
          isFavorite: true,
          createdAt: true,
        },
      },
    },
  });

  const feedbacks = products.flatMap((product) => product.feedbacks);

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
              { label: "Responses", value: feedbacks.length },
              {
                label: "Average rating",
                value: formatRating(averageRating(feedbacks)),
              },
              {
                label: "On your sites",
                value: feedbacks.filter((feedback) => feedback.isFavorite)
                  .length,
              },
            ]}
          />

          <ul className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {products.map((product) => (
              <li key={product.id}>
                <ProductCard details={product} />
              </li>
            ))}
          </ul>
        </>
      )}
    </main>
  );
}
