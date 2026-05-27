import Link from "next/link";
import { Suspense } from "react";
import { auth } from "@/lib/auth";
import SampleCode from "./sample-code";
import Testimonials from "./testimonials";
import { ArrowRight } from "lucide-react";
import type { Variants } from "motion/react";
import * as motion from "motion/react-client";
import { Button } from "@/components/ui/button";
import { EmbeddedTweet } from "react-tweet";
import { getTweet } from "react-tweet/api";
import { normalizeTweet } from "./normalize-tweet";

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

const childVariants: Variants = {
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

  const rawTweet = await getTweet("1836311569610772578");
  const tweet = rawTweet ? normalizeTweet(rawTweet) : null;

  return (
    <motion.section
      className="container mx-auto mt-10 flex w-[90vw] flex-col items-center gap-12 sm:w-[85vw] md:w-[80vw] lg:w-[90vw]"
      variants={parentVariants}
      initial="hidden"
      animate="visible"
    >
      <div>
        <motion.h1
          className="font-instrument-serif mb-6 max-w-4xl text-center text-4xl sm:text-8xl"
          variants={childVariants}
        >
          Turn Customer Feedback Into Social Proof
        </motion.h1>

        <motion.p
          className="text-center text-black/70 dark:text-white/40"
          variants={childVariants}
        >
          Easily collect customer feedback with no technical skills or hosting
          required
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
        className="bg-\ lg:flex- flex w-full flex-col items-center justify-between gap-2 rounded-s-[2.5rem] rounded-t-[2.5rem] p-6 xl:p-12"
        variants={childVariants}
      >
        <div className="flex flex-col gap-6">
          <p className="max-w-4xl text-center text-4xl font-medium text-balance sm:text-5xl">
            Experience an Optimized Feedback Process
          </p>

          <p className="text-center text-black dark:text-white/90">
            Explore a quick demonstration of how it simplifies the feedback
            collection process for your business.
          </p>
        </div>

        {tweet && <EmbeddedTweet tweet={tweet} />}
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
