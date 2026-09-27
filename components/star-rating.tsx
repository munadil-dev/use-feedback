"use client";

import { Star } from "lucide-react";
import { ratingAtom } from "@/store/atoms/rating";
import { useAtom } from "jotai";

export default function StarRating({ labelledBy }: { labelledBy?: string }) {
  const [rating, setRating] = useAtom(ratingAtom);

  return (
    <div
      className="flex gap-1"
      role="group"
      aria-label={labelledBy ? undefined : "Rating"}
      aria-labelledby={labelledBy}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const starIndex = index + 1;

        return (
          <button
            key={starIndex}
            type="button"
            aria-label={`Rate ${starIndex} ${starIndex === 1 ? "star" : "stars"}`}
            aria-pressed={starIndex === rating}
            onClick={() => setRating(starIndex)}
            className="ring-offset-background focus-visible:ring-ring cursor-pointer rounded-sm transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden active:scale-90"
          >
            <Star
              aria-hidden="true"
              className={`size-7 transition-colors duration-150 ${
                starIndex <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-zinc-200 text-zinc-200 hover:fill-zinc-300 hover:text-zinc-300"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}
