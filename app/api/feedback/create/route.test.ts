// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import prisma from "@/lib/db";

vi.mock("@/lib/db", () => ({
  default: {
    product: { findUnique: vi.fn() },
    feedback: { create: vi.fn() },
  },
}));

const mockFindUnique = vi.mocked(prisma.product.findUnique);
const mockCreate = vi.mocked(prisma.feedback.create);

const validFeedback = {
  id: "product-1",
  message: "Loved it",
  customerName: "Jane",
  customerEmail: "jane@example.com",
  customerImage: "",
  rating: 4,
};

function createRequest(body: object) {
  return new NextRequest("http://localhost/api/feedback/create", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/feedback/create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when the product id is missing", async () => {
    const { id: _id, ...withoutId } = validFeedback;

    const res = await POST(createRequest(withoutId));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      message: "Product is required",
      success: false,
    });
    expect(mockFindUnique).not.toHaveBeenCalled();
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns 400 for invalid feedback", async () => {
    const res = await POST(createRequest({ ...validFeedback, rating: 0 }));

    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns 404 when the product does not exist", async () => {
    mockFindUnique.mockResolvedValue(null);

    const res = await POST(createRequest(validFeedback));

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({
      message: "Product not found",
      success: false,
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("creates the feedback for an existing product", async () => {
    mockFindUnique.mockResolvedValue({ id: "product-1" } as never);
    mockCreate.mockResolvedValue({} as never);

    const res = await POST(createRequest(validFeedback));

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({
      message: "Feedback submitted",
      success: true,
    });
    expect(mockCreate).toHaveBeenCalledWith({
      data: {
        message: "Loved it",
        customerName: "Jane",
        customerEmail: "jane@example.com",
        customerImage: "",
        rating: 4,
        product: { connect: { id: "product-1" } },
      },
    });
  });

  it("returns 500 when the database fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockFindUnique.mockRejectedValue(new Error("db down"));

    const res = await POST(createRequest(validFeedback));

    expect(res.status).toBe(500);
  });
});
