"use client";

import { StarFilledSVG } from "@/icons/StarFilled";
import { StarNotFilledSVG } from "@/icons/StarNotFilled";
import { ratingAtom } from "@/store/atoms/rating";
import { useAtom } from "jotai";

export default function StarRating() {
  const [rating, setRating] = useAtom(ratingAtom);

  return (
    <div className="flex gap-1" role="group" aria-label="Rating">
      {Array.from({ length: 5 }, (_, index) => {
        const starIndex = index + 1;

        return (
          <button
            key={starIndex}
            type="button"
            aria-label={`Rate ${starIndex} ${starIndex === 1 ? "star" : "stars"}`}
            aria-pressed={starIndex === rating}
            onClick={() => setRating(starIndex)}
            className="ring-offset-background focus-visible:ring-ring cursor-pointer rounded-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-hidden"
          >
            {starIndex <= rating ? <StarFilledSVG /> : <StarNotFilledSVG />}
          </button>
        );
      })}
    </div>
  );
}
