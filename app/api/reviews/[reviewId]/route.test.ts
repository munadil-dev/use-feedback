// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DELETE, PATCH } from "./route";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db", () => ({
  default: { review: { updateMany: vi.fn(), deleteMany: vi.fn() } },
}));

const mockAuth = vi.mocked(auth as () => Promise<unknown>);
const mockUpdateMany = vi.mocked(prisma.review.updateMany);
const mockDeleteMany = vi.mocked(prisma.review.deleteMany);

const context = { params: Promise.resolve({ reviewId: "review-1" }) };

function favorite(isFavorite: unknown) {
  return PATCH(
    new NextRequest("http://localhost/api/reviews/review-1", {
      method: "PATCH",
      body: JSON.stringify({ isFavorite }),
    }),
    context
  );
}

function remove() {
  return DELETE(
    new NextRequest("http://localhost/api/reviews/review-1", {
      method: "DELETE",
    }),
    context
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PATCH /api/reviews/[reviewId]", () => {
  it("returns 401 without a signed-in user id", async () => {
    for (const session of [null, { user: {} }]) {
      mockAuth.mockResolvedValue(session);

      const res = await favorite(true);

      expect(res.status, JSON.stringify(session)).toBe(401);
    }
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("returns 400 when isFavorite is not a boolean", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const res = await favorite("yes");

    expect(res.status).toBe(400);
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("returns 404 when the review belongs to another user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-2" } });
    mockUpdateMany.mockResolvedValue({ count: 0 });

    const res = await favorite(true);

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({
      message: "Review not found",
      success: false,
    });
  });

  it.each([
    [true, "Added to favorite"],
    [false, "Removed from favorite"],
  ])(
    "sets isFavorite to %s on the user's own review",
    async (isFavorite, message) => {
      mockAuth.mockResolvedValue({ user: { id: "user-1" } });
      mockUpdateMany.mockResolvedValue({ count: 1 });

      const res = await favorite(isFavorite);

      expect(mockUpdateMany).toHaveBeenCalledWith({
        where: { id: "review-1", product: { userId: "user-1" } },
        data: { isFavorite },
      });
      expect(res.status).toBe(200);
      expect(await res.json()).toEqual({ message, success: true });
    }
  );

  it("returns 500 when the database call fails", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockUpdateMany.mockRejectedValue(new Error("connection lost"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await favorite(true);

    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/reviews/[reviewId]", () => {
  it("returns 401 without a signed-in user id", async () => {
    for (const session of [null, { user: {} }]) {
      mockAuth.mockResolvedValue(session);

      const res = await remove();

      expect(res.status, JSON.stringify(session)).toBe(401);
    }
    expect(mockDeleteMany).not.toHaveBeenCalled();
  });

  it("returns 404 when the review belongs to another user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-2" } });
    mockDeleteMany.mockResolvedValue({ count: 0 });

    const res = await remove();

    expect(res.status).toBe(404);
    expect(await res.json()).toEqual({
      message: "Review not found",
      success: false,
    });
  });

  it("deletes the user's own review", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockDeleteMany.mockResolvedValue({ count: 1 });

    const res = await remove();

    expect(mockDeleteMany).toHaveBeenCalledWith({
      where: { id: "review-1", product: { userId: "user-1" } },
    });
    expect(res.status).toBe(200);
    expect(await res.json()).toEqual({
      message: "Review deleted successfully",
      success: true,
    });
  });

  it("returns 500 when the database call fails", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockDeleteMany.mockRejectedValue(new Error("connection lost"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await remove();

    expect(res.status).toBe(500);
  });
});
