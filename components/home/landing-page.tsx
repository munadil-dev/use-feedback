import Link from "next/link";
import { auth } from "@/lib/auth";
import SampleCode from "./sample-code";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function LandingPage() {
  const session = await auth();

  return (
    <section className="flex w-[90vw] flex-col items-center gap-16 sm:w-[85vw] md:w-[80vw] lg:w-[70vw] xl:w-[60vw]">
      <div>
        <h1 className="mb-6 text-center text-4xl font-semibold sm:text-5xl">
          Getting feedback made easy.
        </h1>

        <p className="text-center text-base text-neutral-500 dark:text-neutral-400 sm:text-lg">
          We built UseFeedback to simplify gathering feedback. Easily collect
          customer feedback with no technical skills or hosting required.
        </p>
      </div>

      <div className="flex items-center gap-8 sm:gap-12">
        <Button className="p-6 text-base" asChild>
          <Link href={session?.user ? "/dashboard" : "/auth/signin"}>
            Get started
            <ArrowRight className="ml-1 w-5" />
          </Link>
        </Button>

        <Button className="p-6 text-base" variant="outline" asChild>
          <Link href="/docs">Explore docs</Link>
        </Button>
      </div>

      <div className="w-full">
        <p className="mb-2 text-xl font-medium">Try the sample code below</p>
        <SampleCode />
      </div>
    </section>
  );
}
