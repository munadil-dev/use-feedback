"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, MotionConfig } from "motion/react";
import * as motion from "motion/react-client";
import { ease } from "@/lib/constant/ui.constant";
import { faqs } from "@/lib/constant/faq.constant";
import { siteLinks } from "@/lib/constant/site.constant";

const inlineLink =
  "font-medium text-zinc-950 underline decoration-zinc-300 underline-offset-4 hover:decoration-zinc-950";

function Item({
  question,
  answer,
  link,
  open,
  onToggle,
}: (typeof faqs)[number] & { open: boolean; onToggle: () => void }) {
  const id = useId();

  return (
    <li className="border-b border-zinc-200">
      <h3>
        <button
          type="button"
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={open ? id : undefined}
          className="group focus-visible:ring-primary flex w-full cursor-pointer items-center justify-between gap-6 rounded-md py-5 text-left text-base font-medium text-zinc-950 focus-visible:ring-2 focus-visible:outline-hidden sm:text-[17px]"
        >
          {question}
          <span
            aria-hidden="true"
            className={`relative flex size-7 shrink-0 items-center justify-center rounded-full border transition-[background-color,border-color,color,rotate,scale] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] group-active:scale-90 ${
              open
                ? "border-primary bg-primary rotate-180 text-white"
                : "border-zinc-200 text-zinc-500 group-hover:border-zinc-300 group-hover:text-zinc-900"
            }`}
          >
            <span className="absolute h-[1.5px] w-3 rounded-full bg-current" />
            <span
              className={`absolute h-3 w-[1.5px] rounded-full bg-current transition-[rotate,opacity] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
                open ? "rotate-90 opacity-0" : ""
              }`}
            />
          </span>
        </button>
      </h3>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            id={id}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease }}
            className="overflow-hidden"
          >
            <div className="max-w-xl pr-12 pb-5 text-[15px] leading-6 text-zinc-600">
              <p>{answer}</p>
              {link && (
                <Link
                  href={link.href}
                  className="text-primary mt-2 inline-block font-medium underline-offset-4 hover:underline"
                >
                  {link.label}
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </li>
  );
}

export default function Faq() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <MotionConfig reducedMotion="user">
      <section className="grid gap-10 py-16 lg:grid-cols-12">
        <header className="lg:col-span-5">
          <h2 className="text-3xl leading-[1.12] font-semibold tracking-[-0.03em] text-balance text-zinc-950 sm:text-[2.75rem]">
            Questions. <span className="text-zinc-400">Answered.</span>
          </h2>
          <p className="mt-5 max-w-sm text-[15px] leading-6 text-zinc-600">
            Can&apos;t find what you need? The{" "}
            <Link href="/docs" className={inlineLink}>
              docs
            </Link>{" "}
            cover every step, or{" "}
            <Link
              href={siteLinks.issues}
              target="_blank"
              className={inlineLink}
            >
              open an issue on GitHub
            </Link>
            .
          </p>
        </header>
        <ul className="border-t border-zinc-200 lg:col-span-7">
          {faqs.map((item, index) => (
            <Item
              key={item.question}
              {...item}
              open={openIndex === index}
              onToggle={() =>
                setOpenIndex((current) => (current === index ? null : index))
              }
            />
          ))}
        </ul>
      </section>
    </MotionConfig>
  );
}
