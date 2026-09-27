import { Star } from "lucide-react";

export function Stars({
  count,
  size = "md",
  className = "",
}: {
  count: number;
  size?: "sm" | "md";
  className?: string;
}) {
  return (
    <span
      className={`flex shrink-0 gap-0.5 ${className}`}
      role="img"
      aria-label={`${count} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <Star
          key={index}
          aria-hidden="true"
          className={`${size === "sm" ? "size-3.5" : "size-4"} ${
            index < count
              ? "fill-amber-400 text-amber-400"
              : "fill-zinc-200 text-zinc-200"
          }`}
        />
      ))}
    </span>
  );
}
