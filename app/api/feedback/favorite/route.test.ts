// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db", () => ({
  default: { feedback: { updateMany: vi.fn() } },
}));

// auth() is overloaded (it also wraps middleware), so its mock is typed
// loosely to accept a session object.
const mockAuth = vi.mocked(auth as () => Promise<unknown>);
const mockUpdateMany = vi.mocked(prisma.feedback.updateMany);

function favoriteRequest(body: { feedbackId: string; isFavorite: boolean }) {
  return new NextRequest("http://localhost/api/feedback/favorite", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/feedback/favorite", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when the user is not signed in", async () => {
    mockAuth.mockResolvedValue(null);

    const res = await POST(
      favoriteRequest({ feedbackId: "feedback-1", isFavorite: true })
    );

    expect(res.status).toBe(401);
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("only updates feedback on products the user owns", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockUpdateMany.mockResolvedValue({ count: 1 });

    await POST(favoriteRequest({ feedbackId: "feedback-1", isFavorite: true }));

    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { id: "feedback-1", product: { userId: "user-1" } },
      data: { isFavorite: true },
    });
  });

  it("returns 400 when the feedback belongs to another user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-2" } });
    mockUpdateMany.mockResolvedValue({ count: 0 });

    const res = await POST(
      favoriteRequest({ feedbackId: "feedback-1", isFavorite: true })
    );

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      message: "Feedback not found",
      success: false,
    });
  });

  it.each([
    [true, "Added to favorite"],
    [false, "Removed from favorite"],
  ])("returns 201 when isFavorite is %s", async (isFavorite, message) => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockUpdateMany.mockResolvedValue({ count: 1 });

    const res = await POST(
      favoriteRequest({ feedbackId: "feedback-1", isFavorite })
    );

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({ message, success: true });
  });

  it("returns 500 when the database call fails", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockUpdateMany.mockRejectedValue(new Error("connection lost"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST(
      favoriteRequest({ feedbackId: "feedback-1", isFavorite: true })
    );

    expect(res.status).toBe(500);
  });
});
