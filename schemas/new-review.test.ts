import { describe, expect, it } from "vitest";
import { newReviewSchema } from "./new-review";

const fileId = "0f7c2b5e-1d3a-4c8b-9e6f-2a4b6c8d0e1f";

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

  it("accepts whole ratings from 1 to 5 only", () => {
    for (const rating of [1, 5]) {
      expect(
        newReviewSchema.safeParse({ ...validReview, rating }).success,
        `rating ${rating}`
      ).toBe(true);
    }

    for (const rating of [0, 6, 2.5, undefined]) {
      expect(
        newReviewSchema.safeParse({ ...validReview, rating }).success,
        `rating ${rating}`
      ).toBe(false);
    }
  });

  it("accepts no photo or an Uploadcare photo", () => {
    for (const customerImage of [
      "",
      `https://ucarecdn.com/${fileId}/`,
      `https://ifkueqi105.ucarecd.net/${fileId}/-/preview/`,
    ]) {
      expect(
        newReviewSchema.safeParse({ ...validReview, customerImage }).success,
        customerImage
      ).toBe(true);
    }
  });

  it("rejects photo links that are not Uploadcare files", () => {
    for (const customerImage of [
      "https://evil.example.com/tracker.png",
      `http://ucarecdn.com/${fileId}/`,
      `https://ucarecdn.com.evil.example/${fileId}/`,
      "https://ucarecdn.com/not-a-file/",
      `https://ucarecdn.com/x/${fileId}/`,
      "javascript:alert(1)",
    ]) {
      const result = newReviewSchema.safeParse({
        ...validReview,
        customerImage,
      });

      expect(result.error?.issues[0].message, customerImage).toBe(
        "Upload the photo again"
      );
    }
  });

  it("rejects a message or name longer than the limit", () => {
    for (const [field, length] of [
      ["message", 1001],
      ["customerName", 101],
    ] as const) {
      const result = newReviewSchema.safeParse({
        ...validReview,
        [field]: "a".repeat(length),
      });

      expect(result.success, field).toBe(false);
    }
  });
});
