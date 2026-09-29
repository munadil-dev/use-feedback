// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DELETE, PATCH } from "./route";
import { auth } from "@/lib/auth";
import prisma from "@/lib/db";

vi.mock("@/lib/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db", () => ({
  default: {
    product: { updateMany: vi.fn(), findFirst: vi.fn(), delete: vi.fn() },
  },
}));

const mockAuth = vi.mocked(auth as () => Promise<unknown>);
const mockUpdateMany = vi.mocked(prisma.product.updateMany);
const mockFindFirst = vi.mocked(prisma.product.findFirst);
const mockDelete = vi.mocked(prisma.product.delete);

const context = { params: Promise.resolve({ productId: "product-1" }) };

const product = {
  name: "Acme",
  title: "How are you finding Acme?",
  message: "We read every reply.",
};

function update(body: object | string) {
  return PATCH(
    new NextRequest("http://localhost/api/product/product-1", {
      method: "PATCH",
      body: typeof body === "string" ? body : JSON.stringify(body),
    }),
    context
  );
}

function remove() {
  return DELETE(
    new NextRequest("http://localhost/api/product/product-1", {
      method: "DELETE",
    }),
    context
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("PATCH /api/product/[productId]", () => {
  it("returns 401 when the user is not signed in", async () => {
    mockAuth.mockResolvedValue(null);

    const res = await update(product);

    expect(res.status).toBe(401);
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("returns 400 when a field is empty", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const res = await update({ ...product, title: "  " });

    expect(res.status).toBe(400);
    expect(await res.json()).toEqual({
      message: "Page title is required",
      success: false,
    });
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("returns 400 when the body is not valid JSON", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });

    const res = await update("{");

    expect(res.status).toBe(400);
    expect(mockUpdateMany).not.toHaveBeenCalled();
  });

  it("only updates products the user owns", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockUpdateMany.mockResolvedValue({ count: 1 });

    const res = await update(product);

    expect(res.status).toBe(200);
    expect(mockUpdateMany).toHaveBeenCalledWith({
      where: { id: "product-1", userId: "user-1" },
      data: product,
    });
  });

  it("returns 404 when the product belongs to another user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-2" } });
    mockUpdateMany.mockResolvedValue({ count: 0 });

    const res = await update(product);

    expect(res.status).toBe(404);
  });

  it("returns 500 when the database call fails", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockUpdateMany.mockRejectedValue(new Error("connection lost"));
    vi.spyOn(console, "log").mockImplementation(() => {});

    const res = await update(product);

    expect(res.status).toBe(500);
  });
});

describe("DELETE /api/product/[productId]", () => {
  it("returns 401 when the user is not signed in", async () => {
    mockAuth.mockResolvedValue(null);

    const res = await remove();

    expect(res.status).toBe(401);
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("returns 404 when the product belongs to another user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-2" } });
    mockFindFirst.mockResolvedValue(null);

    const res = await remove();

    expect(res.status).toBe(404);
    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: "product-1", userId: "user-2" },
    });
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("deletes the product when the user owns it", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } });
    mockFindFirst.mockResolvedValue({ id: "product-1" } as never);

    const res = await remove();

    expect(res.status).toBe(200);
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: "product-1" } });
  });
});
