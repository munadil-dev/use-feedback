import { Search } from "lucide-react";
import { Input } from "./ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

export type Tab = "all" | "favorites";

const tabs: { id: Tab; label: string }[] = [
  { id: "all", label: "All" },
  { id: "favorites", label: "Favorites" },
];

const ratings = [
  { value: null, label: "Any rating" },
  ...[5, 4, 3, 2, 1].map((stars) => ({
    value: stars,
    label: `${stars} ${stars === 1 ? "star" : "stars"}`,
  })),
];

export default function FeedbackFilters({
  tab,
  onTabChange,
  counts,
  rating,
  onRatingChange,
  query,
  onQueryChange,
}: {
  tab: Tab;
  onTabChange: (tab: Tab) => void;
  counts: Record<Tab, number>;
  rating: number | null;
  onRatingChange: (rating: number | null) => void;
  query: string;
  onQueryChange: (query: string) => void;
}) {
  return (
    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
      <div className="flex gap-1 rounded-lg bg-zinc-100 p-1">
        {tabs.map(({ id, label }) => (
          <button
            key={id}
            type="button"
            aria-pressed={tab === id}
            onClick={() => onTabChange(id)}
            className="focus-visible:ring-primary flex h-8 flex-1 cursor-pointer items-center justify-center gap-1.5 rounded-md px-3 text-sm font-medium text-zinc-600 transition-colors hover:text-zinc-950 focus-visible:ring-2 focus-visible:outline-hidden aria-pressed:bg-white aria-pressed:text-zinc-950 aria-pressed:shadow-sm sm:flex-none"
          >
            {label}
            <span className="text-zinc-400 tabular-nums">{counts[id]}</span>
          </button>
        ))}
      </div>

      <Select items={ratings} value={rating} onValueChange={onRatingChange}>
        <SelectTrigger aria-label="Filter by rating" className="w-full sm:w-36">
          <SelectValue />
        </SelectTrigger>

        <SelectContent>
          {ratings.map(({ value, label }) => (
            <SelectItem key={label} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="relative sm:ml-auto sm:w-64">
        <Search
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-zinc-400"
        />

        <Input
          type="search"
          aria-label="Search feedback"
          placeholder="Search feedback"
          value={query}
          onChange={(e) => onQueryChange(e.target.value)}
          className="pl-9"
        />
      </div>
    </div>
  );
}
