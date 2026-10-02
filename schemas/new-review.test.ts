import { describe, expect, it } from "vitest";
import { newReviewSchema } from "./new-review";

const validReview = {
  id: "product-1",
  message: "Great product!",
  customerName: "Jane",
  customerEmail: "jane@example.com",
  rating: 5,
};

describe("newReviewSchema", () => {
  it("accepts a valid review", () => {
    expect(newReviewSchema.safeParse(validReview).success).toBe(true);
  });

  it("trims whitespace from message and name", () => {
    const result = newReviewSchema.parse({
      ...validReview,
      message: "  Great product!  ",
      customerName: "  Jane  ",
    });

    expect(result.message).toBe("Great product!");
    expect(result.customerName).toBe("Jane");
  });

  it("rejects a whitespace-only message", () => {
    const result = newReviewSchema.safeParse({
      ...validReview,
      message: "   ",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Message is required");
  });

  it("rejects a missing product id", () => {
    const { id: _id, ...withoutId } = validReview;

    expect(newReviewSchema.safeParse(withoutId).success).toBe(false);
  });

  it("rejects an empty name", () => {
    const result = newReviewSchema.safeParse({
      ...validReview,
      customerName: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Name is required");
  });

  it("rejects an invalid email", () => {
    const result = newReviewSchema.safeParse({
      ...validReview,
      customerEmail: "not-an-email",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Invalid email address");
  });

  it("rejects a missing rating", () => {
    const { rating: _rating, ...withoutRating } = validReview;

    expect(newReviewSchema.safeParse(withoutRating).success).toBe(false);
  });

  it.each([0, 6, 2.5])("rejects a rating of %s", (rating) => {
    const result = newReviewSchema.safeParse({ ...validReview, rating });

    expect(result.success).toBe(false);
  });

  it.each([1, 5])("accepts a rating of %s", (rating) => {
    expect(newReviewSchema.safeParse({ ...validReview, rating }).success).toBe(
      true
    );
  });
});
