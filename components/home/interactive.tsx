"use client";

import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { Check, Copy, Heart, Star } from "lucide-react";
import { AnimatePresence, MotionConfig } from "motion/react";
import * as motion from "motion/react-client";
import { cn } from "@/lib/utils";
import { ease } from "@/lib/constant/ui.constant";
import { typedReplies } from "@/lib/constant/landing.constant";
import { WindowDots } from "./window-dots";

export function CopyButton({
  value,
  label,
  className,
}: {
  value: string;
  label: string;
  className?: string;
}) {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!copied) return;
    const timeoutId = setTimeout(() => setCopied(false), 2000);

    return () => clearTimeout(timeoutId);
  }, [copied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
    } catch {
      toast.error("Could not copy. Select and copy it manually.");
    }
  };

  return (
    <MotionConfig reducedMotion="user">
      <button
        type="button"
        onClick={handleCopy}
        aria-label={copied ? "Copied" : label}
        className={cn(
          "focus-visible:ring-primary flex size-8 shrink-0 cursor-pointer items-center justify-center rounded-md transition-[background-color,color,transform] duration-150 focus-visible:ring-2 focus-visible:outline-hidden active:scale-[0.97]",
          className
        )}
      >
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.span
            key={copied ? "check" : "copy"}
            initial={{ opacity: 0, scale: 0.8, filter: "blur(2px)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.8, filter: "blur(2px)" }}
            transition={{ duration: 0.15, ease }}
          >
            {copied ? (
              <Check className="size-4 text-emerald-500" />
            ) : (
              <Copy className="size-4" />
            )}
          </motion.span>
        </AnimatePresence>
      </button>
    </MotionConfig>
  );
}

export function CopySnippet({
  code,
  children,
}: {
  code: string;
  children: React.ReactNode;
}) {
  return (
    <figure className="w-full min-w-0 overflow-hidden rounded-xl bg-zinc-950 text-[13px] leading-relaxed shadow-[0_1px_2px_rgba(24,24,27,0.2),0_16px_32px_-12px_rgba(24,24,27,0.45)] ring-1 ring-zinc-950/5">
      <figcaption className="flex items-center gap-3 border-b border-white/10 py-1.5 pr-1.5 pl-4 text-xs text-zinc-400">
        <WindowDots tone="muted" />
        <span className="flex-1">index.html</span>
        <CopyButton
          value={code}
          label="Copy embed code"
          className="hover:bg-white/10 hover:text-white focus-visible:ring-white"
        />
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-zinc-300">
        <code>{children}</code>
      </pre>
    </figure>
  );
}

export function HeartButton({
  pressed,
  onToggle,
  label,
  className = "",
}: {
  pressed: boolean;
  onToggle: () => void;
  label: string;
  className?: string;
}) {
  return (
    <MotionConfig reducedMotion="user">
      <motion.button
        type="button"
        onClick={onToggle}
        aria-pressed={pressed}
        aria-label={label}
        whileTap={{ scale: 0.9 }}
        transition={{ duration: 0.12 }}
        className={`focus-visible:ring-primary flex size-9 shrink-0 cursor-pointer touch-manipulation items-center justify-center rounded-full transition-colors hover:bg-rose-50 focus-visible:ring-2 focus-visible:outline-hidden ${className}`}
      >
        <motion.span
          key={String(pressed)}
          initial={{ scale: pressed ? 0.7 : 1 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.35, bounce: 0.5 }}
        >
          <Heart
            className={`size-4.5 transition-colors duration-150 ${
              pressed ? "fill-rose-500 text-rose-500" : "text-zinc-400"
            }`}
          />
        </motion.span>
      </motion.button>
    </MotionConfig>
  );
}

export function FavoriteToggle({
  name,
  initial = false,
}: {
  name: string;
  initial?: boolean;
}) {
  const [favorite, setFavorite] = useState(initial);

  return (
    <HeartButton
      pressed={favorite}
      onToggle={() => setFavorite((current) => !current)}
      label={`Favorite ${name}'s testimonial`}
      className="-m-2"
    />
  );
}

export function CopyLink({ href, display }: { href: string; display: string }) {
  return (
    <div className="flex items-center gap-1 rounded-full border border-zinc-200 bg-white py-1 pr-1 pl-4">
      <a
        href={href}
        target="_blank"
        className="min-w-0 flex-1 truncate text-sm text-zinc-700 underline-offset-4 hover:underline"
      >
        {display}
      </a>
      <CopyButton
        value={href}
        label="Copy review link"
        className="rounded-full text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900"
      />
    </div>
  );
}

export function KeyboardRating({ className = "" }: { className?: string }) {
  const [rating, setRating] = useState(4);
  const starsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const select = (value: number) => {
    const next = Math.min(5, Math.max(1, value));
    setRating(next);
    starsRef.current[next - 1]?.focus();
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "ArrowLeft" || event.key === "ArrowDown") {
      event.preventDefault();
      select(rating - 1);
    }
    if (event.key === "ArrowRight" || event.key === "ArrowUp") {
      event.preventDefault();
      select(rating + 1);
    }
  };

  return (
    <div
      role="radiogroup"
      aria-label="Rating"
      className={`flex gap-1 ${className}`}
      onKeyDown={handleKeyDown}
    >
      {Array.from({ length: 5 }, (_, index) => {
        const value = index + 1;

        return (
          <button
            key={value}
            ref={(element) => {
              starsRef.current[index] = element;
            }}
            type="button"
            role="radio"
            aria-checked={value === rating}
            aria-label={`${value} ${value === 1 ? "star" : "stars"}`}
            tabIndex={value === rating ? 0 : -1}
            onClick={() => select(value)}
            className="focus-visible:ring-primary cursor-pointer touch-manipulation rounded-sm transition-transform duration-150 focus-visible:ring-2 focus-visible:outline-hidden active:scale-90"
          >
            <Star
              className={`size-7 transition-colors duration-150 ${
                value <= rating
                  ? "fill-amber-400 text-amber-400"
                  : "fill-zinc-200 text-zinc-200"
              }`}
            />
          </button>
        );
      })}
    </div>
  );
}

export function TypingText() {
  const [replyIndex, setReplyIndex] = useState(0);
  const [length, setLength] = useState(0);
  const [reduceMotion, setReduceMotion] = useState(false);
  const reply = typedReplies[replyIndex];

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduceMotion(query.matches);
    const onChange = () => setReduceMotion(query.matches);
    query.addEventListener("change", onChange);

    return () => query.removeEventListener("change", onChange);
  }, []);

  useEffect(() => {
    if (reduceMotion) return;

    const delay = length < reply.length ? 45 + Math.random() * 45 : 2000;
    const timeoutId = setTimeout(() => {
      if (length < reply.length) {
        setLength(length + 1);
      } else {
        setLength(0);
        setReplyIndex((current) => (current + 1) % typedReplies.length);
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [length, reply, reduceMotion]);

  return (
    <>
      {reduceMotion ? reply : reply.slice(0, length)}
      <span
        className={`bg-primary ml-px inline-block h-4 w-px translate-y-0.5 ${
          reduceMotion || length === reply.length ? "animate-caret" : ""
        } motion-reduce:animate-none`}
      />
    </>
  );
}
