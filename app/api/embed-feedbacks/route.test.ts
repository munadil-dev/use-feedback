import { screen, within } from "@testing-library/react";
import { NextRequest } from "next/server";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { GET } from "./route";
import prisma from "@/lib/db";

vi.mock("@/lib/db", () => ({
  default: { feedback: { findMany: vi.fn() } },
}));

const mockFindMany = vi.mocked(prisma.feedback.findMany);

const feedbacks = [
  {
    message: "Loved it",
    customerName: "Jane",
    customerImage: "https://ucarecdn.com/jane.png",
    rating: 5,
  },
  {
    message: "<img src=x onerror=alert(1)>",
    customerName: "Sam",
    customerImage: null,
    rating: 2,
  },
];

function embedRequest(query = "?productId=product-1") {
  return new NextRequest(`http://localhost/api/embed-feedbacks${query}`);
}

async function runWidget() {
  document.body.innerHTML = '<div id="embed-feedbacks"></div>';

  const res = await GET(embedRequest());
  new Function(await res.text())();

  return document.getElementById("embed-feedbacks")!;
}

describe("GET /api/embed-feedbacks", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://vouch.munadil.com/");
    mockFindMany.mockResolvedValue(feedbacks as never);
  });

  afterEach(() => {
    vi.unstubAllEnvs();
    document.body.innerHTML = "";
  });

  it("returns 400 when productId is missing", async () => {
    const res = await GET(embedRequest(""));

    expect(res.status).toBe(400);
    expect(mockFindMany).not.toHaveBeenCalled();
  });

  it("serves cacheable JavaScript that any site can load", async () => {
    const res = await GET(embedRequest());

    expect(res.headers.get("Content-Type")).toBe(
      "application/javascript; charset=utf-8"
    );
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
    expect(res.headers.get("Cache-Control")).toBe(
      "public, s-maxage=120, stale-while-revalidate=86400"
    );
  });

  it("only fetches favorite feedback for the product", async () => {
    await GET(embedRequest());

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { productId: "product-1", isFavorite: true },
      })
    );
  });

  it("renders a card per feedback with its stars", async () => {
    const container = await runWidget();
    const cards = container.children;

    expect(cards).toHaveLength(2);
    expect(cards[0]).toHaveTextContent("Jane");
    expect(cards[0]).toHaveTextContent("Loved it");
    expect(cards[0].querySelectorAll("svg")).toHaveLength(5);
    expect(cards[1].querySelectorAll("svg")).toHaveLength(2);
  });

  it("falls back to the site's default avatar when there is no image", async () => {
    const container = await runWidget();
    const [first, second] = container.querySelectorAll("img");

    expect(first).toHaveAttribute("src", "https://ucarecdn.com/jane.png");
    expect(second).toHaveAttribute(
      "src",
      "https://vouch.munadil.com/user-icon.png"
    );
  });

  it("exposes the cards as a labelled list", async () => {
    await runWidget();

    const list = screen.getByRole("list", { name: "Customer feedback" });

    expect(within(list).getAllByRole("listitem")).toHaveLength(2);
  });

  it("describes each rating in text for screen readers", async () => {
    await runWidget();

    expect(
      screen.getByRole("img", { name: "Rated 5 out of 5" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Rated 2 out of 5" })
    ).toBeInTheDocument();
  });

  it("lazy-loads decorative avatars with fixed dimensions", async () => {
    const container = await runWidget();

    container.querySelectorAll("img").forEach((img) => {
      expect(img).toHaveAttribute("alt", "");
      expect(img).toHaveAttribute("loading", "lazy");
      expect(img).toHaveAttribute("width", "35");
      expect(img).toHaveAttribute("height", "35");
    });
  });

  it("leaves the container untouched when there is no feedback", async () => {
    mockFindMany.mockResolvedValue([]);

    const container = await runWidget();

    expect(container).toBeEmptyDOMElement();
    expect(container).not.toHaveAttribute("role");
    expect(container).not.toHaveAttribute("style");
  });

  it("renders messages as text, not HTML", async () => {
    const container = await runWidget();

    expect(container.children[1]).toHaveTextContent(
      "<img src=x onerror=alert(1)>"
    );
    expect(container.querySelectorAll("img")).toHaveLength(2);
  });
});
