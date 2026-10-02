"use client";

import { useState } from "react";
import EmptyState from "./empty-state";
import ReviewCard from "./review-card";
import ReviewFilters, { Tab } from "./review-filters";

type Review = React.ComponentProps<typeof ReviewCard>["review"] & {
  isFavorite: boolean;
};

function getFavoriteIds(reviews: Review[]) {
  return new Set(
    reviews.filter((review) => review.isFavorite).map((review) => review.id)
  );
}

export default function ReviewList({ reviews }: { reviews: Review[] }) {
  const [favoriteIds, setFavoriteIds] = useState(() => getFavoriteIds(reviews));
  const [prevReviews, setPrevReviews] = useState(reviews);
  const [tab, setTab] = useState<Tab>("all");
  const [shownFavoriteIds, setShownFavoriteIds] = useState(favoriteIds);
  const [rating, setRating] = useState<number | null>(null);
  const [query, setQuery] = useState("");

  if (reviews !== prevReviews) {
    setPrevReviews(reviews);
    const nextFavoriteIds = getFavoriteIds(reviews);
    setFavoriteIds(nextFavoriteIds);
    setShownFavoriteIds(new Set([...shownFavoriteIds, ...nextFavoriteIds]));
  }

  const favorites = reviews.filter((review) =>
    favoriteIds.has(review.id)
  ).length;

  const search = query.trim().toLowerCase();
  const visible = reviews.filter(
    (review) =>
      (tab === "all" || shownFavoriteIds.has(review.id)) &&
      (rating === null || review.rating === rating) &&
      [review.message, review.customerName, review.customerEmail].some((text) =>
        text.toLowerCase().includes(search)
      )
  );

  function changeTab(next: Tab) {
    setTab(next);
    setShownFavoriteIds(favoriteIds);
  }

  function setFavorite(reviewId: string, isFavorite: boolean) {
    setFavoriteIds((ids) => {
      const next = new Set(ids);

      if (isFavorite) {
        next.add(reviewId);
      } else {
        next.delete(reviewId);
      }

      return next;
    });
  }

  return (
    <>
      <h2 className="mt-12 text-xl font-semibold tracking-tight text-zinc-950">
        Reviews
      </h2>

      {reviews.length === 0 ? (
        <EmptyState
          title="No reviews yet"
          body="Responses show up here as soon as customers send them."
          className="mt-4"
        />
      ) : (
        <>
          <ReviewFilters
            tab={tab}
            onTabChange={changeTab}
            counts={{ all: reviews.length, favorites }}
            rating={rating}
            onRatingChange={setRating}
            query={query}
            onQueryChange={setQuery}
          />

          {visible.length === 0 ? (
            <EmptyState
              title="No matching reviews"
              body="Try another tab, rating or search."
              className="mt-4"
            />
          ) : (
            <ul className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2">
              {visible.map((review) => (
                <li key={review.id}>
                  <ReviewCard
                    review={review}
                    isFavorite={favoriteIds.has(review.id)}
                    onFavoriteChange={(isFavorite) =>
                      setFavorite(review.id, isFavorite)
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
