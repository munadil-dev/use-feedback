import { describe, expect, it } from "vitest";
import { newFeedbackSchema } from "./new-feedback";

const validFeedback = {
  message: "Great product!",
  customerName: "Jane",
  customerEmail: "jane@example.com",
  rating: 5,
};

describe("newFeedbackSchema", () => {
  it("accepts valid feedback", () => {
    expect(newFeedbackSchema.safeParse(validFeedback).success).toBe(true);
  });

  it("trims whitespace from message and name", () => {
    const result = newFeedbackSchema.parse({
      ...validFeedback,
      message: "  Great product!  ",
      customerName: "  Jane  ",
    });

    expect(result.message).toBe("Great product!");
    expect(result.customerName).toBe("Jane");
  });

  it("rejects a whitespace-only message", () => {
    const result = newFeedbackSchema.safeParse({
      ...validFeedback,
      message: "   ",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Message is required");
  });

  it("rejects an empty name", () => {
    const result = newFeedbackSchema.safeParse({
      ...validFeedback,
      customerName: "",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Name is required");
  });

  it("rejects an invalid email", () => {
    const result = newFeedbackSchema.safeParse({
      ...validFeedback,
      customerEmail: "not-an-email",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe("Invalid email address");
  });

  it("rejects a missing rating", () => {
    const { rating: _rating, ...withoutRating } = validFeedback;

    expect(newFeedbackSchema.safeParse(withoutRating).success).toBe(false);
  });
});
