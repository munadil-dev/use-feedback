// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import prisma from "@/lib/db";

vi.mock("@/lib/db", () => ({
  default: {
    product: { findUnique: vi.fn() },
    productView: { upsert: vi.fn() },
  },
}));

const mockFindUnique = vi.mocked(prisma.product.findUnique);
const mockUpsert = vi.mocked(prisma.productView.upsert);

function view() {
  return POST(
    new NextRequest("http://localhost/api/product/product-1/views", {
      method: "POST",
    }),
    { params: Promise.resolve({ productId: "product-1" }) }
  );
}

beforeEach(() => {
  vi.clearAllMocks();
});

describe("POST /api/product/[productId]/views", () => {
  it("returns 404 for an unknown product", async () => {
    mockFindUnique.mockResolvedValue(null);

    const res = await view();

    expect(res.status).toBe(404);
    expect(mockUpsert).not.toHaveBeenCalled();
  });

  it("counts a view on today's row", async () => {
    vi.useFakeTimers({ now: new Date("2026-09-30T10:00:00Z") });
    mockFindUnique.mockResolvedValue({ id: "product-1" } as never);

    const res = await view();
    vi.useRealTimers();

    const date = new Date("2026-09-30");
    expect(res.status).toBe(200);
    expect(mockUpsert).toHaveBeenCalledWith({
      where: { productId_date: { productId: "product-1", date } },
      create: { productId: "product-1", date },
      update: { count: { increment: 1 } },
    });
  });

  it("returns 500 when the database call fails", async () => {
    mockFindUnique.mockRejectedValue(new Error("connection lost"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await view();

    expect(res.status).toBe(500);
  });
});
