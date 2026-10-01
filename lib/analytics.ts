export const ranges = [7, 30, 90];

export type DailyStat = { date: string; views: number; responses: number };

const DAY = 24 * 60 * 60 * 1000;

export function toDay(date: Date) {
  return date.toISOString().slice(0, 10);
}

export function buildDailySeries(
  days: number,
  views: { date: Date; count: number }[],
  responses: { createdAt: Date }[],
  today = new Date()
): DailyStat[] {
  const series = Array.from({ length: days }, (_, index) => ({
    date: toDay(new Date(today.getTime() - (days - 1 - index) * DAY)),
    views: 0,
    responses: 0,
  }));

  const byDate = new Map(series.map((day) => [day.date, day]));

  for (const view of views) {
    const day = byDate.get(toDay(view.date));
    if (day) day.views += view.count;
  }

  for (const response of responses) {
    const day = byDate.get(toDay(response.createdAt));
    if (day) day.responses += 1;
  }

  return series;
}
