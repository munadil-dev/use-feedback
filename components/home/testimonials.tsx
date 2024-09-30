import { cn } from "@/lib/utils";
import { Variants } from "framer-motion";
import Marquee from "@/components/ui/marquee";
import * as motion from "framer-motion/client";
import { testimonials } from "@/lib/constant/testimonials.constant";

interface TestimonialCardProps {
  name: string;
  username: string;
  body: string;
}

interface TestimonialProps {
  variants?: Variants;
}

const TestimonialCard = ({ name, username, body }: TestimonialCardProps) => {
  return (
    <figure
      className={cn(
        "relative w-64 cursor-pointer overflow-hidden rounded-xl border p-4",
        "border-gray-950/[.1] bg-gray-950/[.01] hover:bg-gray-950/[.05]",
        "dark:border-gray-50/[.1] dark:bg-gray-50/[.10] dark:hover:bg-gray-50/[.15]"
      )}
    >
      <div className="flex flex-row items-center gap-2">
        <div className="h-7 w-7 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500"></div>
        <div className="flex flex-col">
          <figcaption className="text-sm font-medium dark:text-white">
            {name}
          </figcaption>
          <p className="text-xs font-medium dark:text-white/40">{username}</p>
        </div>
      </div>
      <blockquote className="mt-2 text-sm">{body}</blockquote>
    </figure>
  );
};

export default function Testimonials({ variants }: TestimonialProps) {
  return (
    <motion.div
      className="relative flex h-fit w-full flex-col items-center justify-center overflow-hidden rounded-lg bg-background"
      variants={variants}
    >
      <Marquee pauseOnHover className="[--duration:30s]">
        {testimonials.map((testimonial) => (
          <TestimonialCard key={testimonial.username} {...testimonial} />
        ))}
      </Marquee>

      <div className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-white dark:from-background"></div>
      <div className="pointer-events-none absolute inset-y-0 right-0 w-1/3 bg-gradient-to-l from-white dark:from-background"></div>
    </motion.div>
  );
}
