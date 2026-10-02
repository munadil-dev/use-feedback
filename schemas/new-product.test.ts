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
});
