const tones = [
  "bg-rose-100 text-rose-700",
  "bg-amber-100 text-amber-800",
  "bg-emerald-100 text-emerald-700",
  "bg-sky-100 text-sky-700",
  "bg-violet-100 text-violet-700",
];

const sizes = {
  sm: "size-7 text-xs",
  md: "size-9 text-sm",
};

export function Avatar({
  name,
  size = "sm",
}: {
  name: string;
  size?: keyof typeof sizes;
}) {
  const tone =
    tones[
      [...name].reduce((sum, char) => sum + char.charCodeAt(0), 0) %
        tones.length
    ];

  return (
    <span
      aria-hidden="true"
      className={`flex shrink-0 items-center justify-center rounded-lg font-semibold ${sizes[size]} ${tone}`}
    >
      {name[0].toUpperCase()}
    </span>
  );
}
