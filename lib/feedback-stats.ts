export function averageRating(feedbacks: { rating: number }[]) {
  if (feedbacks.length === 0) {
    return 0;
  }

  const total = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0);

  return total / feedbacks.length;
}

export function formatRating(rating: number) {
  return rating === 0 ? "–" : rating.toFixed(1);
}
