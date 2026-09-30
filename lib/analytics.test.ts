import { describe, expect, it } from "vitest";
import { buildDailySeries } from "./analytics";

const today = new Date("2026-09-30T10:00:00Z");

describe("buildDailySeries", () => {
  it("returns one zeroed day per day in the range, oldest first", () => {
    const series = buildDailySeries(3, [], [], today);

    expect(series).toEqual([
      { date: "2026-09-28", views: 0, responses: 0 },
      { date: "2026-09-29", views: 0, responses: 0 },
      { date: "2026-09-30", views: 0, responses: 0 },
    ]);
  });

  it("adds views and responses to their day", () => {
    const series = buildDailySeries(
      2,
      [{ date: new Date("2026-09-30"), count: 5 }],
      [
        { createdAt: new Date("2026-09-29T23:59:00Z") },
        { createdAt: new Date("2026-09-30T08:00:00Z") },
        { createdAt: new Date("2026-09-30T09:00:00Z") },
      ],
      today
    );

    expect(series).toEqual([
      { date: "2026-09-29", views: 0, responses: 1 },
      { date: "2026-09-30", views: 5, responses: 2 },
    ]);
  });

  it("ignores data outside the range", () => {
    const series = buildDailySeries(
      1,
      [{ date: new Date("2026-09-01"), count: 9 }],
      [{ createdAt: new Date("2026-09-01T12:00:00Z") }],
      today
    );

    expect(series).toEqual([{ date: "2026-09-30", views: 0, responses: 0 }]);
  });
});
