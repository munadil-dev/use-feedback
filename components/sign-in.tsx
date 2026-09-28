import Image from "next/image";
import Link from "next/link";
import { signIn } from "@/lib/auth";
import { GoogleSVG } from "@/icons/Google";
import { Button } from "./ui/button";
import SignInStory from "./sign-in-story";
import skyImage from "@/public/sky.jpg";

export default function SignInComponent({ error }: { error?: string }) {
  return (
    <main className="grid min-h-svh grid-cols-1 lg:grid-cols-2">
      <section className="flex flex-col px-5 py-6 sm:px-10">
        <Link
          className="font-instrument-serif w-fit text-xl font-medium text-zinc-950"
          href="/"
        >
          useFeedback
        </Link>

        <form
          className="mx-auto flex w-full max-w-sm flex-1 flex-col justify-center py-16"
          action={async () => {
            "use server";
            await signIn("google", {
              redirectTo: "/dashboard",
            });
          }}
        >
          <h1 className="text-4xl leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-zinc-950">
            Sign in to useFeedback
          </h1>
          <p className="mt-3 text-[15px] leading-6 text-zinc-600">
            Free to use. Pick up where you left off, or create your first
            product in a minute.
          </p>

          {error && (
            <p
              role="alert"
              className="mt-6 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700"
            >
              Sign in didn&apos;t work. Please try again.
            </p>
          )}

          <Button type="submit" variant="outline" className="mt-8 h-11 w-full">
            <GoogleSVG />
            Continue with Google
          </Button>
        </form>

        <p className="text-sm text-zinc-500">
          New here?{" "}
          <Link
            href="/docs/quickstart"
            className="font-medium text-zinc-950 underline-offset-4 hover:underline"
          >
            Read the quickstart
          </Link>
        </p>
      </section>

      <Showcase />
    </main>
  );
}

function Showcase() {
  return (
    <figure className="relative isolate hidden flex-col justify-center overflow-hidden px-12 py-16 lg:flex">
      <Image
        src={skyImage}
        alt=""
        fill
        priority
        placeholder="blur"
        sizes="50vw"
        className="-z-10 object-cover"
      />
      <figcaption className="mx-auto mb-10 max-w-sm text-center text-2xl leading-tight font-semibold tracking-[-0.03em] text-balance text-white drop-shadow-sm">
        Ask once. Show the best replies on your site.
      </figcaption>
      <SignInStory />
    </figure>
  );
}
