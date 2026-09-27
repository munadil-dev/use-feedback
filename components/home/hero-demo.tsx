"use client";

import { useState } from "react";
import { AnimatePresence, MotionConfig } from "motion/react";
import * as motion from "motion/react-client";
import { ease } from "@/lib/constant/ui.constant";
import {
  demoResponses,
  initialFavorites,
} from "@/lib/constant/hero-demo.constant";
import { Avatar } from "./avatar";
import { HeartButton } from "./interactive";
import { Stars } from "./stars";
import { WindowDots } from "./window-dots";

export default function HeroDemo() {
  const [favorites, setFavorites] = useState(initialFavorites);
  const shown = demoResponses.filter((response) =>
    favorites.includes(response.id)
  );

  const toggle = (id: string) =>
    setFavorites((current) =>
      current.includes(id)
        ? current.filter((favorite) => favorite !== id)
        : [...current, id]
    );

  return (
    <MotionConfig reducedMotion="user">
      <div className="grid overflow-hidden rounded-xl border border-white/20 bg-white shadow-[0_1px_2px_rgba(20,30,90,0.2),0_32px_64px_-24px_rgba(20,30,90,0.6)] md:grid-cols-[minmax(0,5fr)_minmax(0,7fr)]">
        <section
          aria-label="Your dashboard"
          className="border-b border-zinc-200 md:border-r md:border-b-0"
        >
          <header className="flex items-baseline justify-between border-b border-zinc-200 px-5 py-4">
            <p className="text-sm font-semibold text-zinc-900">
              Paperjet feedback
            </p>
            <p className="bg-primary/10 text-primary rounded-full px-2 py-0.5 text-xs font-medium tabular-nums">
              {favorites.length} of {demoResponses.length} on your site
            </p>
          </header>

          <ul className="divide-y divide-zinc-100">
            {demoResponses.map((response) => (
              <li
                key={response.id}
                className="flex items-start gap-3 px-5 py-3.5"
              >
                <Avatar name={response.name} />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="truncate text-sm font-medium text-zinc-900">
                      {response.name}
                    </p>
                    <Stars count={response.rating} size="sm" />
                  </div>
                  <p className="mt-0.5 line-clamp-2 text-sm text-zinc-600">
                    {response.message}
                  </p>
                </div>
                <HeartButton
                  pressed={favorites.includes(response.id)}
                  onToggle={() => toggle(response.id)}
                  label={`Show ${response.name}'s feedback on your site`}
                  className="-m-1.5"
                />
              </li>
            ))}
          </ul>
        </section>

        <section aria-label="Your website" className="bg-[#f5f7ff]">
          <header className="flex items-center gap-3 border-b border-zinc-200 bg-white px-5 py-4">
            <WindowDots />
            <p className="text-xs text-zinc-500">paperjet.app</p>
          </header>

          <div className="px-5 py-6 sm:px-8">
            <p className="text-lg font-semibold tracking-tight text-zinc-900">
              What writers say about Paperjet
            </p>

            <ul className="mt-5 flex flex-wrap gap-3" aria-live="polite">
              <AnimatePresence mode="popLayout" initial={false}>
                {shown.map((response) => (
                  <motion.li
                    key={response.id}
                    layout
                    initial={{ opacity: 0, scale: 0.96, filter: "blur(4px)" }}
                    animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                    exit={{
                      opacity: 0,
                      scale: 0.96,
                      transition: { duration: 0.15, ease },
                    }}
                    transition={{ duration: 0.25, ease }}
                    className="flex w-full flex-col gap-3 rounded-[7px] border border-zinc-300/70 bg-white p-3 shadow-[0_1px_2px_rgba(16,24,40,0.05)] sm:w-[calc(50%-6px)]"
                  >
                    <Stars count={response.rating} size="sm" />
                    <blockquote className="text-sm text-zinc-700">
                      {response.message}
                    </blockquote>
                    <div className="flex items-center gap-2">
                      <Avatar name={response.name} />
                      <p className="text-sm font-semibold text-zinc-900">
                        {response.name}
                      </p>
                    </div>
                  </motion.li>
                ))}
              </AnimatePresence>
            </ul>

            {shown.length === 0 && (
              <p className="rounded-[7px] border border-dashed border-zinc-300 p-6 text-center text-sm text-zinc-500">
                Favorite a response to show it here.
              </p>
            )}
          </div>
        </section>
      </div>
    </MotionConfig>
  );
}
