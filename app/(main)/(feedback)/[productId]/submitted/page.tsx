import Link from "next/link";
import SuccessIcon from "@/components/success-icon";

export default function FeedbackSubmitted() {
  return (
    <main className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center px-5 py-12">
      <section className="shadow-card-raised w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-8 text-center">
        <SuccessIcon />
        <h1 className="mt-4 text-xl font-semibold tracking-tight text-zinc-950">
          Thanks for your feedback
        </h1>
        <p className="mt-1 text-sm text-zinc-600">
          Your response was sent. You can close this page.
        </p>

        <p className="mt-8 text-xs text-zinc-500">
          Powered by{" "}
          <Link
            href={process.env.NEXT_PUBLIC_BASE_URL!}
            className="font-medium text-zinc-950 hover:underline"
          >
            useFeedback
          </Link>
        </p>
      </section>
    </main>
  );
}
