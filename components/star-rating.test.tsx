import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { createStore, Provider } from "jotai";
import { describe, expect, it } from "vitest";
import StarRating from "./star-rating";
import { ratingAtom } from "@/store/atoms/rating";

// The stars are plain SVGs with no accessible name, so they are queried
// from the DOM. Filled stars are the ones painted yellow.
const FILLED_STAR = 'path[fill="#ffce31"]';

function renderWithStore(initialRating?: number) {
  const store = createStore();

  if (initialRating !== undefined) {
    store.set(ratingAtom, initialRating);
  }

  const { container } = render(
    <Provider store={store}>
      <StarRating />
    </Provider>
  );

  return { store, container };
}

describe("StarRating", () => {
  it("renders five stars", () => {
    const { container } = renderWithStore();

    expect(container.querySelectorAll("svg")).toHaveLength(5);
  });

  it("fills stars up to the default rating of 3", () => {
    const { container } = renderWithStore();

    expect(container.querySelectorAll(FILLED_STAR)).toHaveLength(3);
  });

  it("raises the rating when an empty star is clicked", async () => {
    const { store, container } = renderWithStore();

    await userEvent.click(container.querySelectorAll("svg")[4]);

    expect(store.get(ratingAtom)).toBe(5);
    expect(container.querySelectorAll(FILLED_STAR)).toHaveLength(5);
  });

  it("lowers the rating when a filled star is clicked", async () => {
    const { store, container } = renderWithStore(5);

    await userEvent.click(container.querySelectorAll("svg")[0]);

    expect(store.get(ratingAtom)).toBe(1);
    expect(container.querySelectorAll(FILLED_STAR)).toHaveLength(1);
  });
});
