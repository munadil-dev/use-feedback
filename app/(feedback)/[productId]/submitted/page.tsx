import Link from "next/link";

export default function FeedbackSubmitted() {
  return (
    <main className="flex min-h-[80svh] items-center justify-center">
      <section className="flex w-[80svw] flex-col items-center gap-2 rounded-lg border p-5 text-center sm:w-[60svw] md:w-[50svw] lg:w-[40svw] xl:w-[30svw]">
        <p className="text-xl font-semibold">
          Feedback submitted successfully &#x1F973;
        </p>

        <p className="text-sm text-neutral-400">Thanks for your feedback!</p>

        <p className="mt-5 text-sm font-medium text-neutral-400">
          Made by{" "}
          <Link
            href={process.env.NEXT_PUBLIC_BASE_URL!}
            className="text-base text-blue-500 hover:underline"
          >
            UseFeedback
          </Link>
        </p>
      </section>
    </main>
  );
}
