"use client";

import { useEffect, useState } from "react";
import { Check, ChevronDown, Copy, ExternalLink } from "lucide-react";
import CodeComponent from "./code";
import { Stars } from "./home/stars";
import { Button, buttonVariants } from "./ui/button";
import { averageRating, formatRating } from "@/lib/feedback-stats";

export function ProductActions({ url }: { url: string }) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeoutId = setTimeout(() => setCopied(false), 2000);

    return () => clearTimeout(timeoutId);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
    } catch {}
  };

  return (
    <div className="flex gap-2">
      <Button variant="outline" type="button" onClick={handleCopy}>
        {copied ? (
          <Check className="size-4 text-emerald-500" />
        ) : (
          <Copy className="size-4" />
        )}

        {copied ? "Copied" : "Copy link"}
      </Button>

      <a
        href={url}
        target="_blank"
        className={buttonVariants({ variant: "outline" })}
      >
        <ExternalLink className="size-4" />
        Open page
      </a>
    </div>
  );
}

export function RatingSummary({
  feedbacks,
}: {
  feedbacks: { rating: number }[];
}) {
  const average = averageRating(feedbacks);

  const counts = [5, 4, 3, 2, 1].map((rating) => ({
    rating,
    count: feedbacks.filter((feedback) => feedback.rating === rating).length,
  }));

  return (
    <section
      aria-label="Ratings"
      className="shadow-card grid grid-cols-1 gap-6 rounded-2xl border border-zinc-200 bg-white p-5 sm:grid-cols-[auto_minmax(0,32rem)] sm:justify-start sm:gap-12 sm:p-6"
    >
      <div>
        <p className="text-5xl font-semibold tracking-[-0.04em] text-zinc-950 tabular-nums">
          {formatRating(average)}
        </p>

        <Stars count={Math.round(average)} className="mt-3" />

        <p className="mt-2 text-sm text-zinc-500 tabular-nums">
          {feedbacks.length} {feedbacks.length === 1 ? "response" : "responses"}
        </p>
      </div>

      <ul className="flex flex-col justify-center gap-2">
        {counts.map(({ rating, count }) => (
          <li
            key={rating}
            className="flex items-center gap-3 text-sm text-zinc-600 tabular-nums"
          >
            <span className="w-3 text-right">{rating}</span>

            <span className="h-2 flex-1 overflow-hidden rounded-full bg-zinc-100">
              <span
                className="block h-full rounded-full bg-amber-400"
                style={{
                  width: `${feedbacks.length ? (count / feedbacks.length) * 100 : 0}%`,
                }}
              />
            </span>

            <span className="w-6 text-right text-zinc-500">{count}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}

export function ShareSection({
  url,
  code,
  defaultOpen,
}: {
  url: string;
  code: string;
  defaultOpen: boolean;
}) {
  return (
    <details
      open={defaultOpen}
      className="group shadow-card rounded-2xl border border-zinc-200 bg-white"
    >
      <summary className="focus-visible:ring-primary flex cursor-pointer list-none items-center justify-between gap-4 rounded-2xl px-5 py-4 focus-visible:ring-2 focus-visible:outline-hidden sm:px-6 [&::-webkit-details-marker]:hidden">
        <span>
          <span className="block font-semibold tracking-tight text-zinc-950">
            Share and embed
          </span>

          <span className="mt-0.5 block text-sm text-zinc-600">
            Your feedback link and the widget for your site.
          </span>
        </span>

        <ChevronDown
          aria-hidden="true"
          className="size-5 shrink-0 text-zinc-400 transition-transform duration-200 group-open:rotate-180"
        />
      </summary>

      <div className="grid grid-cols-1 gap-6 border-t border-zinc-100 px-5 py-5 sm:px-6 lg:grid-cols-2">
        <div>
          <h2 className="text-sm font-medium text-zinc-950">Feedback link</h2>

          <p className="mt-1 text-sm text-zinc-600">
            Send this to customers so they can leave feedback.
          </p>

          <a
            className="mt-4 block rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 font-mono text-[13px] break-all text-zinc-700 transition-colors hover:border-zinc-300 hover:text-zinc-950"
            href={url}
            target="_blank"
          >
            {url}
          </a>
        </div>

        <div className="min-w-0">
          <h2 className="text-sm font-medium text-zinc-950">Website widget</h2>

          <p className="mt-1 text-sm text-zinc-600">
            Paste this where your favorites should appear.
          </p>

          <CodeComponent code={code} />
        </div>
      </div>
    </details>
  );
}
