export default function EmptyState({
  title,
  body,
  className = "",
  children,
}: {
  title: string;
  body: string;
  className?: string;
  children?: React.ReactNode;
}) {
  return (
    <section
      className={`flex flex-col items-center rounded-2xl border border-dashed border-zinc-300 bg-white px-6 py-16 text-center ${className}`}
    >
      <h2 className="font-medium text-zinc-950">{title}</h2>
      <p className="mt-1 max-w-sm text-sm text-zinc-600">{body}</p>
      {children}
    </section>
  );
}
