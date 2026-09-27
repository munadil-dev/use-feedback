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
    vi.stubEnv("NEXT_PUBLIC_BASE_URL", "https://usefeedback.munadil.com/");
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

  it("serves JavaScript that any site can load", async () => {
    const res = await GET(embedRequest());

    expect(res.headers.get("Content-Type")).toBe("application/javascript");
    expect(res.headers.get("Access-Control-Allow-Origin")).toBe("*");
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
      "https://usefeedback.munadil.com/user-icon.png"
    );
  });

  it("renders messages as text, not HTML", async () => {
    const container = await runWidget();

    expect(container.children[1]).toHaveTextContent(
      "<img src=x onerror=alert(1)>"
    );
    expect(container.querySelectorAll("img")).toHaveLength(2);
  });
});
