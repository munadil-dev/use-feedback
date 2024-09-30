import Link from "next/link";
import { auth } from "@/lib/auth";
import { Tweet } from "react-tweet";
import SampleCode from "./sample-code";
import Testimonials from "./testimonials";
import { ArrowRight } from "lucide-react";
import * as motion from "framer-motion/client";
import { Button } from "@/components/ui/button";

const parentVariants = {
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: {
      delayChildren: 0.6,
      staggerChildren: 0.2,
    },
  },
};

const childVariants = {
  hidden: {
    y: -20,
    opacity: 0,
  },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      damping: 10,
      duration: 0.2,
      stiffness: 100,
    },
  },
};

export default async function LandingPage() {
  const session = await auth();

  return (
    <motion.section
      className="flex w-[90vw] flex-col items-center gap-12 sm:w-[85vw] md:w-[80vw] lg:w-[90vw]"
      variants={parentVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        <motion.h1
          className="mb-6 text-center text-4xl sm:text-6xl"
          variants={childVariants}
        >
          Getting feedback made easy.
        </motion.h1>

        <motion.p
          className="text-center font-medium text-black/70 dark:text-white/65"
          variants={childVariants}
        >
          Easily collect customer feedback with no technical skills or hosting
          required.
        </motion.p>
      </div>

      <motion.div variants={childVariants}>
        <Button className="rounded-full p-6 text-base" asChild>
          <Link href={session?.user ? "/dashboard" : "/auth/signin"}>
            Get started
            <ArrowRight className="ml-2 w-5" />
          </Link>
        </Button>
      </motion.div>

      <motion.div
        className="bg-hero flex w-full flex-col items-center justify-between gap-2 rounded-s-[2.5rem] rounded-t-[2.5rem] p-6 lg:flex-row xl:p-12"
        variants={childVariants}
      >
        <div className="flex w-[90%] flex-col gap-6 lg:w-[45%]">
          <p className="text-center text-4xl sm:text-5xl lg:text-start xl:text-6xl">
            Experience an Optimized Feedback Process
          </p>

          <p className="text-center text-black dark:text-white/90 lg:text-start">
            Explore a quick demonstration of how it simplifies the feedback
            collection process for your business.
          </p>
        </div>

        <Tweet id="1836311569610772578" />
      </motion.div>

      <motion.div
        className="w-[90vw] sm:w-[85vw] md:w-[80vw] lg:w-[70vw]"
        variants={childVariants}
      >
        <p className="mb-6 text-center text-3xl font-medium">
          Try the sample code below
        </p>
        <SampleCode />
      </motion.div>

      <motion.p
        className="text-center text-xl font-medium"
        variants={childVariants}
      >
        Discover how UseFeedback is making a difference for our users.
      </motion.p>

      <Testimonials variants={childVariants} />
    </motion.section>
  );
}
