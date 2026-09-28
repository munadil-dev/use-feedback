"use client";

import { useState } from "react";
import EmptyState from "./empty-state";
import FeedbackCard from "./feedback-card";

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

  if (feedbacks !== prevFeedbacks) {
    setPrevFeedbacks(feedbacks);
    setFavoriteIds(getFavoriteIds(feedbacks));
  }

  const favorites = feedbacks.filter((feedback) =>
    favoriteIds.has(feedback.id)
  ).length;

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
      <header className="mt-12 flex items-baseline justify-between gap-4">
        <h2 className="text-xl font-semibold tracking-tight text-zinc-950">
          Feedback
        </h2>
        <p className="text-sm text-zinc-500 tabular-nums">
          {favorites} of {feedbacks.length} on your site
        </p>
      </header>

      {feedbacks.length === 0 ? (
        <EmptyState
          title="No feedback yet"
          body="Responses show up here as soon as customers send them."
          className="mt-4"
        />
      ) : (
        <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
          {feedbacks.map((feedback) => (
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
  );
}
