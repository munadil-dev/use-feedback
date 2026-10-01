"use client";

import { useState } from "react";
import StatsBar from "./stats-bar";
import { RatingSummary } from "./product-overview";
import { buildDailySeries, ranges } from "@/lib/analytics";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const rangeItems = ranges.map((days) => ({
  value: days,
  label: `Last ${days} days`,
}));

const formatDay = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  });

const plural = (count: number, word: string) =>
  `${count} ${count === 1 ? word : `${word}s`}`;

const tooltipPosition = (index: number, length: number) => {
  if (index < length / 4) return "left-0";
  if (index >= (length * 3) / 4) return "right-0";
  return "left-1/2 -translate-x-1/2";
};

export default function ProductAnalytics({
  views,
  feedbacks,
}: {
  views: { date: Date; count: number }[];
  feedbacks: { rating: number; createdAt: Date }[];
}) {
  const [range, setRange] = useState(30);
  const [active, setActive] = useState(-1);

  const series = buildDailySeries(range, views, feedbacks);
  const totalViews = series.reduce((sum, day) => sum + day.views, 0);
  const totalResponses = series.reduce((sum, day) => sum + day.responses, 0);
  const max = Math.max(
    1,
    ...series.map((day) => Math.max(day.views, day.responses))
  );

  const height = (value: number) => `${(value / max) * 100}%`;
  const focusable =
    active >= 0 && active < series.length ? active : series.length - 1;

  const moveFocus = (event: React.KeyboardEvent<HTMLDivElement>) => {
    const keys: Record<string, number> = {
      ArrowLeft: focusable - 1,
      ArrowRight: focusable + 1,
      Home: 0,
      End: series.length - 1,
    };
    const next = keys[event.key];

    if (next === undefined) return;
    event.preventDefault();

    const index = Math.min(Math.max(next, 0), series.length - 1);
    setActive(index);
    (event.currentTarget.children[index] as HTMLElement).focus();
  };

  return (
    <section
      aria-label="Analytics"
      className="shadow-card rounded-2xl border border-zinc-200 bg-white"
    >
      <div className="p-5 sm:p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-semibold tracking-tight text-zinc-950">
            Traffic
          </h2>

          <Select
            items={rangeItems}
            value={range}
            onValueChange={(value) => value && setRange(value)}
          >
            <SelectTrigger aria-label="Date range" className="w-36">
              <SelectValue />
            </SelectTrigger>

            <SelectContent>
              {rangeItems.map(({ value, label }) => (
                <SelectItem key={value} value={value}>
                  {label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <StatsBar
          className="mt-5"
          stats={[
            { label: "Views", value: totalViews },
            { label: "Responses", value: totalResponses },
            {
              label: "Conversion",
              value: totalViews
                ? `${((totalResponses / totalViews) * 100).toFixed(1)}%`
                : "–",
            },
          ]}
        />

        {totalViews === 0 && totalResponses === 0 ? (
          <p className="mt-6 flex h-32 items-center justify-center rounded-lg border border-dashed border-zinc-200 px-4 text-center text-sm text-zinc-500">
            No views in the last {range} days. Share your link to get some.
          </p>
        ) : (
          <>
            <div
              role="list"
              aria-label={`Daily views and responses, last ${range} days. Use arrow keys to move between days.`}
              onKeyDown={moveFocus}
              className="mt-6 flex h-32 items-end gap-px sm:gap-0.5"
            >
              {series.map((day, index) => (
                <div
                  key={day.date}
                  role="listitem"
                  tabIndex={index === focusable ? 0 : -1}
                  aria-label={`${formatDay(day.date)}: ${plural(day.views, "view")}, ${plural(day.responses, "response")}`}
                  onFocus={() => setActive(index)}
                  className="group focus-visible:ring-ring relative h-full flex-1 rounded-t-sm bg-zinc-50 outline-none hover:bg-zinc-100 focus-visible:bg-zinc-100 focus-visible:ring-2"
                >
                  <span
                    className="bg-primary/20 group-hover:bg-primary/30 group-focus-visible:bg-primary/30 absolute inset-x-0 bottom-0 rounded-t-sm"
                    style={{ height: height(day.views) }}
                  />

                  <span
                    className="bg-primary absolute inset-x-0 bottom-0 rounded-t-sm"
                    style={{ height: height(day.responses) }}
                  />

                  <span
                    aria-hidden
                    className={`pointer-events-none absolute bottom-full z-10 mb-2 hidden rounded-md bg-zinc-900 px-2.5 py-1.5 text-xs whitespace-nowrap text-white shadow-md group-hover:block group-focus-visible:block ${tooltipPosition(index, series.length)}`}
                  >
                    <span className="block font-medium">
                      {formatDay(day.date)}
                    </span>

                    <span className="block text-zinc-300 tabular-nums">
                      {plural(day.views, "view")}
                    </span>

                    <span className="block text-zinc-300 tabular-nums">
                      {plural(day.responses, "response")}
                    </span>
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-2 flex items-center justify-between gap-4 text-xs text-zinc-500">
              <span>{formatDay(series[0].date)}</span>

              <span className="flex gap-4">
                <span className="flex items-center gap-1.5">
                  <span className="bg-primary/20 size-2 rounded-full" />
                  Views
                </span>

                <span className="flex items-center gap-1.5">
                  <span className="bg-primary size-2 rounded-full" />
                  Responses
                </span>
              </span>

              <span>{formatDay(series[series.length - 1].date)}</span>
            </div>
          </>
        )}
      </div>

      {feedbacks.length > 0 && (
        <div className="border-t border-zinc-100 p-5 sm:p-6">
          <h2 className="mb-4 font-semibold tracking-tight text-zinc-950">
            Ratings{" "}
            <span className="font-normal text-zinc-500">· all time</span>
          </h2>

          <RatingSummary feedbacks={feedbacks} />
        </div>
      )}
    </section>
  );
}
