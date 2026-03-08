"use client";

import { useSetAtom } from "jotai";
import { ratingAtom } from "@/store/atoms/rating";

export const StarFilledSVG = ({ index }: { index: number }) => {
  const setRating = useSetAtom(ratingAtom);

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xlinkHref="http://www.w3.org/1999/xlink"
      width="30px"
      height="30px"
      viewBox="0 0 64 64"
      aria-hidden="true"
      role="img"
      preserveAspectRatio="xMidYMid meet"
      className="cursor-pointer"
      onClick={() => setRating(index)}
    >
      <path
        d="M62 25.2H39.1L32 3l-7.1 22.2H2l18.5 13.7l-7 22.1L32 47.3L50.5 61l-7.1-22.2L62 25.2z"
        fill="#ffce31"
      />
    </svg>
  );
};
