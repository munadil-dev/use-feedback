export default function StatsBar({
  stats,
  className = "",
}: {
  stats: { label: string; value: React.ReactNode }[];
  className?: string;
}) {
  return (
    <dl
      className={`shadow-card grid grid-cols-3 divide-x divide-zinc-100 rounded-2xl border border-zinc-200 bg-white ${className}`}
    >
      {stats.map((stat) => (
        <div key={stat.label} className="min-w-0 px-4 py-4 sm:px-6 sm:py-5">
          <dt className="truncate text-xs text-zinc-500 sm:text-sm">
            {stat.label}
          </dt>

          <dd className="mt-1.5 text-2xl font-semibold tracking-tight text-zinc-950 tabular-nums sm:text-3xl">
            {stat.value}
          </dd>
        </div>
      ))}
    </dl>
  );
}
