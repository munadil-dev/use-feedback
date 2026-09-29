"use client";

import { useState } from "react";
import EmptyState from "./empty-state";
import FeedbackCard from "./feedback-card";
import FeedbackFilters, { Tab } from "./feedback-filters";

type Feedback = React.ComponentProps<typeof FeedbackCard>["feedback"] & {
  isFavorite: boolean;
};

function getFavoriteIds(feedbacks: Feedback[]) {
  return new Set(
    feedbacks
      .filter((feedback) => feedback.isFavorite)
      .map((feedback) => feedback.id)
  );
}

export default function FeedbackList({ feedbacks }: { feedbacks: Feedback[] }) {
  const [favoriteIds, setFavoriteIds] = useState(() =>
    getFavoriteIds(feedbacks)
  );
  const [prevFeedbacks, setPrevFeedbacks] = useState(feedbacks);
  const [tab, setTab] = useState<Tab>("all");
  const [shownFavoriteIds, setShownFavoriteIds] = useState(favoriteIds);
  const [rating, setRating] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  if (feedbacks !== prevFeedbacks) {
    setPrevFeedbacks(feedbacks);
    const nextFavoriteIds = getFavoriteIds(feedbacks);
    setFavoriteIds(nextFavoriteIds);
    setShownFavoriteIds(new Set([...shownFavoriteIds, ...nextFavoriteIds]));
  }

  const favorites = feedbacks.filter((feedback) =>
    favoriteIds.has(feedback.id)
  ).length;

  const search = query.trim().toLowerCase();
  const visible = feedbacks.filter(
    (feedback) =>
      (tab === "all" || shownFavoriteIds.has(feedback.id)) &&
      (rating === null || feedback.rating === rating) &&
      [feedback.message, feedback.customerName, feedback.customerEmail].some(
        (text) => text.toLowerCase().includes(search)
      )
  );

  function changeTab(next: Tab) {
    setTab(next);
    setShownFavoriteIds(favoriteIds);
  }

  function setFavorite(feedbackId: string, isFavorite: boolean) {
    setFavoriteIds((ids) => {
      const next = new Set(ids);

      if (isFavorite) {
        next.add(feedbackId);
      } else {
        next.delete(feedbackId);
      }

      return next;
    });
  }

  return (
    <>
      <h2 className="mt-12 text-xl font-semibold tracking-tight text-zinc-950">
        Feedback
      </h2>

      {feedbacks.length === 0 ? (
        <EmptyState
          title="No feedback yet"
          body="Responses show up here as soon as customers send them."
          className="mt-4"
        />
      ) : (
        <>
          <FeedbackFilters
            tab={tab}
            onTabChange={changeTab}
            counts={{ all: feedbacks.length, favorites }}
            rating={rating}
            onRatingChange={setRating}
            query={query}
            onQueryChange={setQuery}
          />

          {visible.length === 0 ? (
            <EmptyState
              title="No matching feedback"
              body="Try another tab, rating or search."
              className="mt-4"
            />
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {visible.map((feedback) => (
                <li key={feedback.id}>
                  <FeedbackCard
                    feedback={feedback}
                    isFavorite={favoriteIds.has(feedback.id)}
                    onFavoriteChange={(isFavorite) =>
                      setFavorite(feedback.id, isFavorite)
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </>
      )}
    </>
  );
}
