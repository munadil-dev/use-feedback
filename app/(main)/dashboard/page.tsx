import Link from "next/link";
import prisma from "@/lib/db";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import * as motion from "motion/react-client";
import ProductCard from "@/components/product-card";

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
        },
      },
    },
  });

  return (
    <main className="flex min-h-[80svh] justify-center">
      <section className="container mx-auto flex w-[90vw] flex-col gap-8 sm:w-[70vw]">
        <article className="mt-10 flex items-center justify-between">
          <h1 className="font-instrument-serif text-3xl font-medium">
            Products
          </h1>

          <Link
            className="rounded-md bg-purple-400 px-4 py-2 text-sm font-medium transition-colors duration-200 hover:bg-purple-300"
            href="/dashboard/new-product"
          >
            &#43; Create a new product
          </Link>
        </article>

        <motion.article
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{
            duration: 0.5,
            type: "spring",
            damping: 10,
            stiffness: 100,
          }}
          className="flex flex-col gap-5"
        >
          {products.length === 0 && (
            <div className="flex min-h-[50svh] items-center justify-center text-neutral-400">
              <p>No products yet, create a new one.</p>
            </div>
          )}

          {products.map((product) => {
            return <ProductCard key={product.id} details={product} />;
          })}
        </motion.article>
      </section>
    </main>
  );
}
