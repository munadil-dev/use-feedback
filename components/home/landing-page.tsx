import Image from "next/image";
import Link from "next/link";
import { ImagePlus } from "lucide-react";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import { GithubIconSVG } from "@/icons/Github";
import { buttonVariants } from "@/components/ui/button";
import { grainTexture } from "@/lib/constant/ui.constant";
import { siteLinks } from "@/lib/constant/site.constant";
import skyImage from "@/public/sky.jpg";
import {
  demoFeedbackUrl,
  embedCode,
  platforms,
  stack,
  steps,
} from "@/lib/constant/landing.constant";
import HeroDemo from "./hero-demo";
import Testimonials from "./testimonials";
import Faq from "./faq";
import { Scene } from "./scene";
import {
  CopyLink,
  CopySnippet,
  KeyboardRating,
  TypingText,
} from "./interactive";

export default async function LandingPage() {
  const session = await auth();
  const startHref = session?.user ? "/dashboard" : "/auth/signin";

  return (
    <>
      <Hero startHref={startHref} />
      <div className="mx-auto flex max-w-6xl flex-col px-5">
        <Steps />
        <Features />
      </div>
      <Testimonials />
      <div className="mx-auto flex max-w-6xl flex-col px-5">
        <Faq />
        <Closing startHref={startHref} />
      </div>
    </>
  );
}

function SimpleIcon({
  slug,
  color,
  size,
}: {
  slug: string;
  color: string;
  size: number;
}) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`https://cdn.simpleicons.org/${slug}/${color}`}
      alt=""
      width={size}
      height={size}
      loading="lazy"
    />
  );
}

function Hero({ startHref }: { startHref: string }) {
  return (
    <div className="relative isolate">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-14 -z-10 h-[49.5rem] bg-white mask-[radial-gradient(ellipse_75%_85%_at_50%_0%,#000_45%,transparent_100%)] sm:h-[55.5rem]"
      >
        <Image
          src={skyImage}
          alt=""
          fill
          priority
          placeholder="blur"
          sizes="100vw"
          className="object-cover object-bottom opacity-45"
        />
      </div>
      <section className="mx-auto max-w-6xl px-5 pt-16 sm:pt-24">
        <div className="flex flex-col items-center text-center">
          <h1 className="max-w-4xl text-5xl leading-[1.02] font-semibold tracking-[-0.045em] text-balance text-zinc-950 sm:text-[5.25rem]">
            Collect testimonials. Show the ones you love.
          </h1>
          <p className="mt-6 max-w-xl text-lg leading-7 text-pretty text-zinc-700">
            Send customers a link, favorite the best replies, and they appear on
            your website with two lines of HTML.
          </p>
          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Link href={startHref} className={buttonVariants({ size: "lg" })}>
              Start collecting
            </Link>
            <Link
              href="/docs"
              className={buttonVariants({ variant: "outline", size: "lg" })}
            >
              Read the docs
            </Link>
          </div>
        </div>

        <figure className="relative isolate mt-16 overflow-hidden rounded-3xl px-3 pt-10 pb-4 shadow-[0_40px_80px_-40px_rgba(31,62,181,0.55)] sm:mt-20 sm:px-14 sm:pt-20 sm:pb-28">
          <Scene id="hero" />
          <div className="mx-auto max-w-5xl">
            <HeroDemo />
          </div>
          <figcaption className="mt-5 text-center text-sm font-medium text-white/90 sm:mt-8">
            Try it: click a heart and watch the site update.
          </figcaption>
        </figure>

        <div className="mt-14 flex flex-col items-center gap-6">
          <p className="text-sm text-zinc-500">Paste it into any site</p>
          <ul className="flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
            {platforms.map((platform) => (
              <li
                key={platform.slug}
                className="flex items-center gap-2 text-[17px] font-semibold tracking-tight text-zinc-400"
              >
                <SimpleIcon slug={platform.slug} color="a1a1aa" size={20} />
                {platform.name}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </div>
  );
}

function SectionHeader({ title, body }: { title: string; body: string }) {
  return (
    <h2 className="max-w-3xl text-3xl leading-[1.12] font-semibold tracking-[-0.03em] text-balance text-zinc-950 sm:text-[2.75rem]">
      {title} <span className="text-zinc-400">{body}</span>
    </h2>
  );
}

function Steps() {
  return (
    <section className="pt-32 pb-16">
      <SectionHeader
        title="Live in about five minutes."
        body="Nothing to build, host or maintain."
      />
      <ol className="mt-12 grid overflow-hidden rounded-2xl border border-zinc-200 bg-white sm:grid-cols-3">
        {steps.map((step, index) => (
          <li
            key={step.title}
            className="border-zinc-200 p-6 not-last:border-b sm:p-8 sm:not-last:border-r sm:not-last:border-b-0"
          >
            <span
              aria-hidden="true"
              className="bg-primary shadow-highlight flex size-8 items-center justify-center rounded-lg text-sm font-semibold text-white tabular-nums"
            >
              {index + 1}
            </span>
            <h3 className="mt-5 text-base font-semibold text-zinc-950">
              {step.title}
            </h3>
            <p className="mt-1.5 text-[15px] leading-6 text-zinc-600">
              {step.body}
            </p>
          </li>
        ))}
      </ol>
    </section>
  );
}

function Cell({
  className = "",
  title,
  body,
  blue = false,
  children,
}: {
  className?: string;
  title: string;
  body: string;
  blue?: boolean;
  children: React.ReactNode;
}) {
  return (
    <article
      className={`relative isolate flex min-w-0 flex-col overflow-hidden rounded-2xl ${
        blue ? "bg-primary" : "shadow-card border border-zinc-200 bg-white"
      } ${className}`}
    >
      {blue ? (
        <>
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 bg-[linear-gradient(rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.08)_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_top,#000_20%,transparent_75%)] bg-size-[40px_40px]"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 -z-10 opacity-[0.18] mix-blend-overlay"
            style={{ backgroundImage: grainTexture }}
          />
        </>
      ) : (
        <div
          aria-hidden="true"
          className="absolute inset-0 -z-10 bg-[radial-gradient(#d4d4d8_1px,transparent_1px)] mask-[radial-gradient(ellipse_at_bottom,#000_10%,transparent_70%)] bg-size-[16px_16px]"
        />
      )}
      <header className="px-6 pt-6 sm:px-8 sm:pt-8">
        <h3
          className={`text-xl font-semibold tracking-tight ${
            blue ? "text-white" : "text-zinc-950"
          }`}
        >
          {title}
        </h3>
        <p
          className={`mt-2 max-w-md text-[15px] leading-6 ${
            blue ? "text-white/80" : "text-zinc-600"
          }`}
        >
          {body}
        </p>
      </header>
      <div className="flex min-w-0 flex-1 flex-col items-center justify-end gap-4 px-5 pt-10 pb-8 sm:px-8">
        {children}
      </div>
    </article>
  );
}

function ProductMark() {
  return (
    <span
      aria-hidden="true"
      className="flex size-7 shrink-0 items-center justify-center rounded-lg bg-zinc-950 text-xs font-semibold text-white"
    >
      P
    </span>
  );
}

function FormMock() {
  return (
    <div className="shadow-card-raised w-full max-w-md rounded-xl border border-zinc-200 bg-white p-5 sm:p-6">
      <div className="flex items-center gap-2.5">
        <ProductMark />
        <p className="text-sm font-medium text-zinc-950">Acme</p>
      </div>
      <p className="mt-5 text-lg font-semibold tracking-tight text-zinc-950">
        How was your first week with Acme?
      </p>
      <KeyboardRating className="mt-4" />
      <div
        aria-hidden="true"
        className="border-primary/50 ring-primary/10 mt-4 h-20 rounded-lg border bg-white p-3 text-sm text-zinc-800 ring-4"
      >
        <TypingText />
      </div>
      <div
        className="mt-4 flex items-center justify-between"
        aria-hidden="true"
      >
        <span className="flex items-center gap-1.5 rounded-md border border-dashed border-zinc-300 px-2.5 py-1.5 text-xs text-zinc-500">
          <ImagePlus className="size-3.5" />
          Add a photo
        </span>
        <span className="bg-primary shadow-highlight rounded-md px-3 py-1.5 text-xs font-medium text-white">
          Send feedback
        </span>
      </div>
    </div>
  );
}

function EmailMock() {
  return (
    <div className="w-full space-y-3">
      <article className="shadow-card-raised overflow-hidden rounded-xl border border-zinc-200 bg-white">
        <header className="flex items-center gap-2.5 border-b border-zinc-100 px-4 py-3">
          <ProductMark />
          <div className="min-w-0 text-xs">
            <p className="font-medium text-zinc-950">Acme</p>
            <p className="truncate text-zinc-500">How did your order go?</p>
          </div>
        </header>
        <div className="p-4">
          <p className="text-sm leading-6 text-zinc-600">
            Hi Priya, got a minute? Tell us how it went.
          </p>
          <a
            href={demoFeedbackUrl}
            target="_blank"
            className={cn(buttonVariants({ size: "sm" }), "mt-3 w-full")}
          >
            Leave a review
          </a>
        </div>
      </article>
      <CopyLink
        href={demoFeedbackUrl}
        display="usefeedback.munadil.com/cm0w1y…"
      />
    </div>
  );
}

function EmbedLine({
  tag,
  attr,
  children,
}: {
  tag: string;
  attr: string;
  children: React.ReactNode;
}) {
  return (
    <>
      <span className="text-zinc-500">&lt;</span>
      <span className="text-sky-300">{tag}</span>{" "}
      <span className="text-violet-300">{attr}</span>=
      <span className="text-amber-200">&quot;{children}&quot;</span>
      <span className="text-zinc-500">&gt;&lt;/</span>
      <span className="text-sky-300">{tag}</span>
      <span className="text-zinc-500">&gt;</span>
    </>
  );
}

function EmbedCode() {
  return (
    <CopySnippet code={embedCode}>
      <EmbedLine tag="div" attr="id">
        embed-feedbacks
      </EmbedLine>
      {"\n"}
      <EmbedLine tag="script" attr="src">
        https://usefeedback.munadil.com/api/embed-feedbacks?productId=
        <span className="rounded bg-white/10 px-1 text-white">
          YOUR_PRODUCT_ID
        </span>
      </EmbedLine>
    </CopySnippet>
  );
}

function Features() {
  return (
    <section className="py-16">
      <SectionHeader
        title="Everything between asking and showing."
        body="From the first ask to the quote on your homepage."
      />

      <div className="mt-12 grid gap-4 md:grid-cols-6">
        <Cell
          className="md:col-span-4"
          title="A form people finish"
          body="A star rating, a message and an optional photo. It works with a mouse, a thumb or the arrow keys."
        >
          <FormMock />
        </Cell>

        <Cell
          className="md:col-span-2"
          title="One link to share"
          body="Put it in an email, a receipt or a post. Try ours."
        >
          <EmailMock />
        </Cell>

        <Cell
          className="md:col-span-3"
          title="Two lines on your site"
          body="Plain JavaScript with no iframe, served from a CDN cache. Works on WordPress, Webflow, Framer and React."
        >
          <EmbedCode />
        </Cell>

        <Cell
          blue
          className="md:col-span-3"
          title="Yours to run"
          body="MIT licensed. Use the hosted version, or run it on your own server and database."
        >
          <ul className="flex flex-wrap justify-center gap-2">
            {stack.map((item) => (
              <li
                key={item.slug}
                className="flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 py-1 pr-3 pl-2 text-xs font-medium text-white backdrop-blur-sm"
              >
                <SimpleIcon slug={item.slug} color="ffffff" size={14} />
                {item.name}
              </li>
            ))}
          </ul>
          <Link
            href={siteLinks.github}
            target="_blank"
            className="flex w-full max-w-sm items-center gap-3 rounded-xl border border-white/15 bg-white p-4 shadow-[0_12px_32px_-12px_rgba(20,30,90,0.55)] transition-transform duration-150 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden active:scale-[0.98]"
          >
            <span className="[&_svg]:size-7">
              <GithubIconSVG />
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-sm font-semibold text-zinc-950">
                munadil-dev/use-feedback
              </span>
              <span className="block text-sm text-zinc-500">
                Star it, fork it, run it
              </span>
            </span>
            <span className="bg-primary/10 text-primary rounded-md px-2 py-0.5 text-xs font-medium">
              MIT
            </span>
          </Link>
        </Cell>
      </div>
    </section>
  );
}

function Closing({ startHref }: { startHref: string }) {
  return (
    <section className="relative isolate mt-16 mb-24 overflow-hidden rounded-3xl px-6 pt-20 pb-40 text-center sm:pt-24 sm:pb-56">
      <Scene id="closing" />
      <h2 className="mx-auto max-w-2xl text-4xl leading-[1.05] font-semibold tracking-[-0.04em] text-balance text-white sm:text-6xl">
        Ask your first customer today
      </h2>
      <p className="mx-auto mt-5 max-w-md text-lg leading-7 text-white/85">
        Free to use. Sign in with Google and create a product.
      </p>
      <div className="mt-9 flex flex-wrap justify-center gap-3">
        <Link
          href={startHref}
          className={cn(
            buttonVariants({ size: "lg" }),
            "bg-white text-zinc-950 shadow-[0_1px_2px_rgba(20,30,90,0.3)] hover:bg-zinc-100"
          )}
        >
          Start collecting
        </Link>
        <Link
          href="/docs/quickstart"
          className={cn(
            buttonVariants({ variant: "outline", size: "lg" }),
            "border-white/30 bg-white/10 text-white shadow-none backdrop-blur-sm hover:bg-white/20"
          )}
        >
          Read the quickstart
        </Link>
      </div>
    </section>
  );
}
