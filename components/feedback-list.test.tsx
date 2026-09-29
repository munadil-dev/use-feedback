import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios from "axios";
import { describe, expect, it, vi } from "vitest";
import FeedbackList from "./feedback-list";

vi.mock("next/navigation", () => ({ useRouter: () => ({ refresh: vi.fn() }) }));

const feedback = (
  id: string,
  customerName: string,
  rating: number,
  isFavorite: boolean
) => ({
  id,
  message: `Message from ${customerName}`,
  customerName,
  customerEmail: `${customerName.toLowerCase()}@example.com`,
  customerImage: null,
  rating,
  createdAt: new Date("2026-09-29"),
  isFavorite,
});

const feedbacks = [
  feedback("1", "Ana", 5, true),
  feedback("2", "Ben", 2, false),
  feedback("3", "Cleo", 5, false),
];

function names() {
  return screen
    .queryAllByRole("listitem")
    .map((item) => within(item).getByText(/^(Ana|Ben|Cleo)$/).textContent);
}

describe("FeedbackList filters", () => {
  it("shows only favorites on the Favorites tab", async () => {
    render(<FeedbackList feedbacks={feedbacks} />);

    await userEvent.click(screen.getByRole("button", { name: /Favorites/ }));

    expect(names()).toEqual(["Ana"]);
  });

  it("filters by rating and search together", async () => {
    render(<FeedbackList feedbacks={feedbacks} />);

    await userEvent.click(screen.getByLabelText("Filter by rating"));
    await userEvent.click(
      await screen.findByRole("option", { name: "5 stars" })
    );
    expect(names()).toEqual(["Ana", "Cleo"]);

    await userEvent.type(screen.getByLabelText("Search feedback"), "CLEO@");
    expect(names()).toEqual(["Cleo"]);
  });

  it("shows an empty state when nothing matches", async () => {
    render(<FeedbackList feedbacks={feedbacks} />);

    await userEvent.type(screen.getByLabelText("Search feedback"), "zzz");

    expect(screen.getByText("No matching feedback")).toBeInTheDocument();
  });

  it("keeps an unfavorited card on the Favorites tab until the tab changes", async () => {
    vi.spyOn(axios, "patch").mockResolvedValue({ data: { success: true } });
    render(<FeedbackList feedbacks={feedbacks} />);

    const favoritesTab = screen.getByRole("button", { name: /Favorites/ });
    await userEvent.click(favoritesTab);
    await userEvent.click(
      within(screen.getByRole("listitem")).getByRole("button", {
        pressed: true,
      })
    );

    expect(names()).toEqual(["Ana"]);
    expect(favoritesTab).toHaveTextContent("0");

    await userEvent.click(screen.getByRole("button", { name: /All/ }));
    await userEvent.click(favoritesTab);

    expect(screen.getByText("No matching feedback")).toBeInTheDocument();
  });

  it("shows new favorites on the Favorites tab when feedbacks change", async () => {
    const { rerender } = render(<FeedbackList feedbacks={feedbacks} />);

    await userEvent.click(screen.getByRole("button", { name: /Favorites/ }));
    rerender(
      <FeedbackList
        feedbacks={feedbacks.map((item) => ({ ...item, isFavorite: true }))}
      />
    );

    expect(names()).toEqual(["Ana", "Ben", "Cleo"]);
  });
});
