export function averageRating(reviews: { rating: number }[]) {
  if (reviews.length === 0) {
    return 0;
  }

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);

  return total / reviews.length;
}

export function formatRating(rating: number) {
  return rating === 0 ? "–" : rating.toFixed(1);
}
