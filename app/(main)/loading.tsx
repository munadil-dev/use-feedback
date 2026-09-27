import Loader from "@/components/loader";

export default function Loading() {
  return (
    <div className="flex min-h-[calc(100svh-3.5rem)] items-center justify-center">
      <Loader />
    </div>
  );
}
