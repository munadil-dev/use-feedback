import Image from "next/image";
import skyImage from "@/public/sky.jpg";

export default function NoProducts({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={`relative isolate flex flex-col items-center overflow-hidden rounded-3xl px-6 py-20 text-center ${className}`}
    >
      <Image
        src={skyImage}
        alt=""
        fill
        placeholder="blur"
        sizes="(min-width: 1152px) 1152px, 100vw"
        className="-z-10 object-cover"
      />

      <h2 className="text-2xl font-semibold tracking-tight text-white">
        Create your first product
      </h2>

      <p className="mt-2 max-w-sm text-[15px] leading-6 text-white/85">
        You get a review link to send to customers and a widget that shows the
        reviews you pick.
      </p>

      {children}
    </section>
  );
}
