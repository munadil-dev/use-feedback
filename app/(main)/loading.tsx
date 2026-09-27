import Loader from "@/components/loader";

export default function Loading() {
  return (
    <div className="flex min-h-[80svh] items-center justify-center dark:invert">
      <Loader />
    </div>
  );
}
