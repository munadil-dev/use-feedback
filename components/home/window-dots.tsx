import { windowDots } from "@/lib/constant/ui.constant";

export function WindowDots({
  tone = "color",
}: {
  tone?: keyof typeof windowDots;
}) {
  return (
    <span className="flex gap-1.5" aria-hidden="true">
      {windowDots[tone].map((color, index) => (
        <span key={index} className={`size-2.5 rounded-full ${color}`} />
      ))}
    </span>
  );
}
