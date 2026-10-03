// @vitest-environment node
import { NextRequest } from "next/server";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { POST } from "./route";
import prisma from "@/lib/db";
import { Prisma } from "@/prisma/generated/prisma/client";

vi.mock("@/lib/db", () => ({
  default: {
    productView: { upsert: vi.fn() },
  },
}));

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
  mockUpsert.mockResolvedValue({} as never);
});

describe("POST /api/product/[productId]/views", () => {
  it("returns 404 for an unknown product", async () => {
    mockUpsert.mockRejectedValue(
      new Prisma.PrismaClientKnownRequestError("Missing product", {
        code: "P2003",
        clientVersion: "test",
      })
    );

    const res = await view();

    expect(res.status).toBe(404);
  });

  it("counts a view on today's row", async () => {
    vi.useFakeTimers({ now: new Date("2026-09-30T10:00:00Z") });

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
    mockUpsert.mockRejectedValue(new Error("connection lost"));
    vi.spyOn(console, "error").mockImplementation(() => {});

    const res = await view();

    expect(res.status).toBe(500);
  });
});
