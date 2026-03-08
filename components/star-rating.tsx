"use client";

import { StarFilledSVG } from "@/icons/StarFilled";
import { StarNotFilledSVG } from "@/icons/StarNotFilled";
import { ratingAtom } from "@/store/atoms/rating";
import { useAtomValue } from "jotai";

export default function StarRating() {
  const rating = useAtomValue(ratingAtom);

  return (
    <div className="flex gap-1">
      {Array.from({ length: 5 }, (_, index) => {
        const starIndex = index + 1;

        if (starIndex <= rating) {
          return <StarFilledSVG key={starIndex} index={starIndex} />;
        }

        return <StarNotFilledSVG key={starIndex} index={starIndex} />;
      })}
    </div>
  );
}
