// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db", () => ({
  default: { product: { create: vi.fn() } },
}));

const mockAuth = vi.mocked(auth as () => Promise<unknown>);
const mockCreate = vi.mocked(prisma.product.create);

const product = {
  name: "Acme",
  title: "How are you finding Acme?",
  message: "We read every reply.",
};

function createRequest(body: object) {
  return new NextRequest("http://localhost/api/product", {
    method: "POST",
    body: JSON.stringify(body),
  });
}

describe("POST /api/product", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("returns 401 without a signed-in user id", async () => {
    for (const session of [null, { user: {} }]) {
      mockAuth.mockResolvedValue(session);

      const res = await POST(createRequest(product));

      expect(res.status, JSON.stringify(session)).toBe(401);
    }
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns 400 when a field is empty", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const res = await POST(createRequest({ ...product, name: "  " }));

    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns 400 when the body is not valid JSON", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const res = await POST(
      new NextRequest("http://localhost/api/product", {
        method: "POST",
        body: "{",
      })
    );

    expect(res.status).toBe(400);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns the new product id", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockCreate.mockResolvedValue({ id: "product-1" } as never);

    const res = await POST(createRequest(product));

    expect(res.status).toBe(201);
    expect(await res.json()).toEqual({
      id: "product-1",
      message: "Product created",
      success: true,
    });
  });
});
