"use client";

import { useEffect, useState } from "react";
import { Heart, Link2 } from "lucide-react";
import { AnimatePresence, MotionConfig, useReducedMotion } from "motion/react";
import * as motion from "motion/react-client";
import { ease } from "@/lib/constant/ui.constant";
import { demoResponses } from "@/lib/constant/hero-demo.constant";
import { Avatar } from "./home/avatar";
import { Stars } from "./home/stars";
import { WindowDots } from "./home/window-dots";

const replies = ["priya", "tom", "lena"].map((id) =>
  demoResponses.find((response) => response.id === id)!
);

const heartedAt: Record<string, number> = { priya: 4, lena: 5 };
const lastStep = 5;

export default function SignInStory() {
  const reduceMotion = useReducedMotion();
  const [step, setStep] = useState(0);
  const shownStep = reduceMotion ? lastStep : step;

  useEffect(() => {
    if (reduceMotion) return;

    const timeout = setTimeout(
      () => setStep((current) => (current === lastStep ? 0 : current + 1)),
      step === lastStep ? 3500 : 1100
    );

    return () => clearTimeout(timeout);
  }, [step, reduceMotion]);

  const arrived = replies.slice(0, shownStep);
  const isHearted = (id: string) => shownStep >= (heartedAt[id] ?? Infinity);
  const onSite = replies.filter((reply) => isHearted(reply.id));

  return (
    <MotionConfig reducedMotion="user">
      <div aria-hidden="true" className="mx-auto flex w-full max-w-sm flex-col">
        <p className="flex w-fit items-center gap-2 self-center rounded-full bg-white/90 py-1.5 pr-4 pl-3 text-sm text-zinc-700 shadow-[0_1px_2px_rgba(20,30,90,0.2)] backdrop-blur-sm">
          <Link2 className="text-primary size-4" />
          usefeedback.munadil.com/acme
        </p>

        <ul className="mt-6 flex h-[17.5rem] flex-col gap-2.5">
          <AnimatePresence initial={false}>
            {arrived.map((reply) => (
              <motion.li
                key={reply.id}
                layout
                initial={{ opacity: 0, y: 16, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, transition: { duration: 0.3 } }}
                transition={{ duration: 0.5, ease }}
                className="flex items-start gap-3 rounded-xl border border-white/60 bg-white p-3.5 shadow-[0_1px_2px_rgba(20,30,90,0.15),0_16px_32px_-16px_rgba(20,30,90,0.45)]"
              >
                <Avatar name={reply.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {reply.name}
                    </p>
                    <Stars count={reply.rating} size="sm" />
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-sm text-zinc-600">
                    {reply.message}
                  </p>
                </div>
                <motion.span
                  animate={
                    isHearted(reply.id) ? { scale: [1, 1.35, 1] } : { scale: 1 }
                  }
                  transition={{ duration: 0.4, ease }}
                >
                  <Heart
                    className={`size-4 transition-colors ${
                      isHearted(reply.id)
                        ? "fill-rose-500 text-rose-500"
                        : "text-zinc-300"
                    }`}
                  />
                </motion.span>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>

        <div className="mt-6 overflow-hidden rounded-xl border border-white/60 bg-white shadow-[0_1px_2px_rgba(20,30,90,0.2),0_32px_64px_-24px_rgba(20,30,90,0.6)]">
          <div className="flex items-center gap-3 border-b border-zinc-200 px-4 py-2.5">
            <WindowDots />
            <span className="text-xs text-zinc-500">acme.app</span>
          </div>
          <div className="bg-zinc-50 p-4">
            <p className="text-sm font-semibold text-zinc-900">
              What customers say about Acme
            </p>
            <ul className="mt-3 grid h-24 grid-cols-2 gap-2.5">
              {[0, 1].map((slot) => (
                <li
                  key={slot}
                  className="relative rounded-lg border border-dashed border-zinc-300"
                >
                  <AnimatePresence initial={false}>
                    {onSite[slot] && (
                      <motion.div
                        key={onSite[slot].id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, transition: { duration: 0.3 } }}
                        transition={{ duration: 0.4, ease }}
                        className="absolute -inset-px flex flex-col rounded-lg border border-zinc-200 bg-white p-2.5"
                      >
                        <Stars count={onSite[slot].rating} size="sm" />
                        <p className="mt-1.5 line-clamp-2 text-xs leading-4 text-zinc-600">
                          {onSite[slot].message}
                        </p>
                        <p className="mt-auto pt-1 text-xs font-medium text-zinc-900">
                          {onSite[slot].name}
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </MotionConfig>
  );
}
