// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import prisma from "@/lib/db";
import { storeUploadcareFile } from "@/lib/uploadcare";
import { Prisma } from "@/prisma/generated/prisma/client";

vi.mock("@/lib/db", () => ({
  default: {
    review: { create: vi.fn() },
  },
}));

vi.mock("@/lib/uploadcare", () => ({ storeUploadcareFile: vi.fn() }));

const mockCreate = vi.mocked(prisma.review.create);

const validReview = {
  id: "product-1",
  message: "Loved it",
  customerName: "Jane",
  customerEmail: "jane@example.com",
  customerImage: "",
  rating: 4,
};

function createRequest(body: object) {
  return new NextRequest("http://localhost/api/reviews", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/reviews", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 400 when the product id is missing", async () => {
    const { id: _id, ...withoutId } = validReview;

    const res = await POST(createRequest(withoutId));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      message: "Product is required",
      success: false,
    });
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns 400 when the body is not valid JSON", async () => {
    const res = await POST(
      new NextRequest("http://localhost/api/reviews", {
        method: "POST",
        body: "{",
      })
    );

    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns 400 for an invalid review", async () => {
    const res = await POST(createRequest({ ...validReview, rating: 0 }));

    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it.each(["P2025", "P2003"])(
    "returns 404 when the product does not exist (%s)",
    async (code) => {
      mockCreate.mockRejectedValue(
        new Prisma.PrismaClientKnownRequestError("Missing product", {
          code,
          clientVersion: "test",
        })
      );

      const res = await POST(createRequest(validReview));

      expect(res.status).toBe(404);
      expect(await res.json()).toEqual({
        message: "Product not found",
        success: false,
      });
    }
  );

  it("creates the review for an existing product", async () => {
    mockCreate.mockResolvedValue({} as never);

    const res = await POST(createRequest(validReview));

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({
      message: "Review submitted",
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
    mockCreate.mockRejectedValue(new Error("db down"));

    const res = await POST(createRequest(validReview));

    expect(res.status).toBe(500);
  });

  it("keeps the uploaded photo once the review is saved", async () => {
    const customerImage =
      "https://ifkueqi105.ucarecd.net/0f7c2b5e-1d3a-4c8b-9e6f-2a4b6c8d0e1f/";
    mockCreate.mockResolvedValue({} as never);

    const res = await POST(createRequest({ ...validReview, customerImage }));

    expect(res.status).toBe(201);
    expect(storeUploadcareFile).toHaveBeenCalledWith(customerImage);
  });

  it("does not touch Uploadcare without a photo or when saving fails", async () => {
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockCreate.mockResolvedValueOnce({} as never);

    await POST(createRequest(validReview));

    mockCreate.mockRejectedValueOnce(new Error("db down"));

    await POST(
      createRequest({
        ...validReview,
        customerImage:
          "https://ifkueqi105.ucarecd.net/0f7c2b5e-1d3a-4c8b-9e6f-2a4b6c8d0e1f/",
      })
    );

    expect(storeUploadcareFile).not.toHaveBeenCalled();
  });
});
