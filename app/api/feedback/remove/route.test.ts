// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db", () => ({
  default: { feedback: { deleteMany: vi.fn() } },
}));

const mockAuth = vi.mocked(auth as () => Promise<unknown>);
const mockDeleteMany = vi.mocked(prisma.feedback.deleteMany);

function removeRequest(feedbackId: string) {
  return new NextRequest("http://localhost/api/feedback/remove", {
    method: "POST",
    body: JSON.stringify({ feedbackId }),
  });
}

describe("POST /api/feedback/remove", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when the user is not signed in", async () => {
    mockAuth.mockResolvedValue(null);

    const res = await POST(removeRequest("feedback-1"));

    expect(res.status).toBe(401);
    expect(mockDeleteMany).not.toHaveBeenCalled();
  });

  it("only deletes feedback on products the user owns", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockDeleteMany.mockResolvedValue({ count: 1 });

    await POST(removeRequest("feedback-1"));

    expect(mockDeleteMany).toHaveBeenCalledWith({
      where: { id: "feedback-1", product: { userId: "user-1" } },
    });
  });

  it("returns 400 when the feedback belongs to another user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-2" } });
    mockDeleteMany.mockResolvedValue({ count: 0 });

    const res = await POST(removeRequest("feedback-1"));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      message: "Feedback not found",
      success: false,
    });
  });

  it("returns 201 when the owner deletes their feedback", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockDeleteMany.mockResolvedValue({ count: 1 });

    const res = await POST(removeRequest("feedback-1"));

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({
      message: "Feedback deleted successfully",
      success: true,
    });
  });

  it("returns 500 when the database call fails", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockDeleteMany.mockRejectedValue(new Error("connection lost"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await POST(removeRequest("feedback-1"));

    expect(res.status).toBe(500);
  });
});
