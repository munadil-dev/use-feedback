"use client";

import { useState } from "react";
import { Bar, BarChart, XAxis } from "recharts";
import StatsBar from "./stats-bar";
import { RatingSummary } from "./product-overview";
import { buildDailySeries, ranges } from "@/lib/analytics";
import {
  type ChartConfig,
  ChartContainer,
} from "./evilcharts/ui/recharts-chart";
import {
  ChartTooltip,
  ChartTooltipContent,
} from "./evilcharts/ui/recharts-tooltip";
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

const chartConfig = {
  views: { label: "Views", colors: { light: ["hsl(var(--primary) / 0.2)"] } },
  responses: { label: "Responses", colors: { light: ["hsl(var(--primary))"] } },
} satisfies ChartConfig;

export default function ProductAnalytics({
  views,
  feedbacks,
}: {
  views: { date: Date; count: number }[];
  feedbacks: { rating: number; createdAt: Date }[];
}) {
  const [range, setRange] = useState(30);

  const series = buildDailySeries(range, views, feedbacks);
  const totalViews = series.reduce((sum, day) => sum + day.views, 0);
  const totalResponses = series.reduce((sum, day) => sum + day.responses, 0);

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
            <ChartContainer
              config={chartConfig}
              className="mt-6 aspect-auto h-32"
            >
              <BarChart
                accessibilityLayer
                data={series}
                margin={{ top: 0, right: 0, bottom: 0, left: 0 }}
              >
                <XAxis dataKey="date" hide />

                <XAxis dataKey="date" xAxisId="responses" hide />

                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      labelFormatter={(date) => formatDay(String(date))}
                    />
                  }
                />

                <Bar
                  dataKey="views"
                  fill="var(--color-views-0)"
                  radius={[2, 2, 0, 0]}
                />

                <Bar
                  dataKey="responses"
                  xAxisId="responses"
                  fill="var(--color-responses-0)"
                  radius={[2, 2, 0, 0]}
                />
              </BarChart>
            </ChartContainer>

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
