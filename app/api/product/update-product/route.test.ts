// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db", () => ({
  default: { product: { updateMany: vi.fn() } },
}));

const mockAuth = vi.mocked(auth as () => Promise<unknown>);
const mockUpdateMany = vi.mocked(prisma.product.updateMany);

const product = {
  productId: "product-1",
  name: "Acme",
  title: "How are you finding Acme?",
  message: "We read every reply.",
};

function updateRequest(body: object) {
  return new NextRequest("http://localhost/api/product/update-product", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/product/update-product", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 when the user is not signed in", async () => {
    mockAuth.mockResolvedValue(null);

    const res = await POST(updateRequest(product));

    expect(res.status).toBe(401);
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("returns 400 when a field is empty", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const res = await POST(updateRequest({ ...product, title: "  " }));

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      message: "Page title is required",
      success: false,
    });
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("returns 400 when the body is not valid JSON", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const res = await POST(
      new NextRequest("http://localhost/api/product/update-product", {
        method: "POST",
        body: "{",
      })
    );

    expect(res.status).toBe(400);
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("only updates products the user owns", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockUpdateMany.mockResolvedValue({ count: 1 });

    const res = await POST(updateRequest(product));

    expect(res.status).toBe(200);
    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { id: "product-1", userId: "user-1" },
      data: {
        name: "Acme",
        title: "How are you finding Acme?",
        message: "We read every reply.",
      },
    });
  });

  it("returns 404 when the product belongs to another user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-2" } });
    mockUpdateMany.mockResolvedValue({ count: 0 });

    const res = await POST(updateRequest(product));

    expect(res.status).toBe(404);
  });

  it("returns 500 when the database call fails", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockUpdateMany.mockRejectedValue(new Error("connection lost"));
    vi.spyOn(console, "log").mockImplementation(() => {});

    const res = await POST(updateRequest(product));

    expect(res.status).toBe(500);
  });
});
