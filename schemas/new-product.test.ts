import { describe, expect, it } from "vitest";
import { newProductSchema } from "./new-product";

const validProduct = {
  name: "Vouch",
  title: "How was your experience?",
  message: "Thanks for the review!",
};

describe("newProductSchema", () => {
  it("accepts a valid product", () => {
    expect(newProductSchema.safeParse(validProduct).success).toBe(true);
  });

  it.each([
    ["name", "Product name is required"],
    ["title", "Page title is required"],
    ["message", "Message is required"],
  ])("rejects a blank %s", (field, expectedMessage) => {
    const result = newProductSchema.safeParse({
      ...validProduct,
      [field]: "   ",
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toBe(expectedMessage);
  });

  it("rejects fields longer than their limit", () => {
    for (const [field, length] of [
      ["name", 101],
      ["title", 151],
      ["message", 501],
    ] as const) {
      const result = newProductSchema.safeParse({
        ...validProduct,
        [field]: "a".repeat(length),
      });

      expect(result.success, field).toBe(false);
    }
  });
});
