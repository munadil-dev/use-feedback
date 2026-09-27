import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createStore, Provider } from "jotai";
import { describe, expect, it, vi } from "vitest";
import StarRating from "./star-rating";
import { ratingAtom } from "@/store/atoms/rating";

function renderWithStore(initialRating?: number) {
  const store = createStore();

  if (initialRating !== undefined) {
    store.set(ratingAtom, initialRating);
  }

  render(
    <Provider store={store}>
      <StarRating />
    </Provider>
  );

  return store;
}

const star = (name: string) => screen.getByRole("button", { name });

describe("StarRating", () => {
  it("renders five labelled star buttons in a rating group", () => {
    renderWithStore();

    const group = screen.getByRole("group", { name: "Rating" });

    expect(group).toBeInTheDocument();
    expect(screen.getAllByRole("button")).toHaveLength(5);
    expect(star("Rate 1 star")).toBeInTheDocument();
    expect(star("Rate 5 stars")).toBeInTheDocument();
  });

  it("marks only the selected star as pressed", () => {
    renderWithStore();

    expect(star("Rate 3 stars")).toHaveAttribute("aria-pressed", "true");
    expect(star("Rate 2 stars")).toHaveAttribute("aria-pressed", "false");
    expect(star("Rate 4 stars")).toHaveAttribute("aria-pressed", "false");
  });

  it("raises the rating when a higher star is clicked", async () => {
    const store = renderWithStore();

    await userEvent.click(star("Rate 5 stars"));

    expect(store.get(ratingAtom)).toBe(5);
    expect(star("Rate 5 stars")).toHaveAttribute("aria-pressed", "true");
  });

  it("lowers the rating when a lower star is clicked", async () => {
    const store = renderWithStore(5);

    await userEvent.click(star("Rate 1 star"));

    expect(store.get(ratingAtom)).toBe(1);
  });

  it("can be rated with the keyboard", async () => {
    const user = userEvent.setup();
    const store = renderWithStore();

    await user.tab();
    await user.tab();
    await user.keyboard("{Enter}");

    expect(store.get(ratingAtom)).toBe(2);

    await user.tab();
    await user.tab();
    await user.keyboard(" ");

    expect(store.get(ratingAtom)).toBe(4);
  });

  it("does not submit the surrounding form", async () => {
    const onSubmit = vi.fn((e) => e.preventDefault());
    const store = createStore();

    render(
      <Provider store={store}>
        <form onSubmit={onSubmit}>
          <StarRating />
        </form>
      </Provider>
    );

    await userEvent.click(star("Rate 4 stars"));

    expect(onSubmit).not.toHaveBeenCalled();
  });
});
