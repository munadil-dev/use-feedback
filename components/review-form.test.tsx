import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios, { AxiosError, AxiosHeaders } from "axios";
import { createStore, Provider } from "jotai";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ReviewForm from "./review-form";
import { ratingAtom } from "@/store/atoms/rating";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  useRouter: () => ({ push }),
}));

vi.mock("next/dynamic", () => ({
  default: () => () => null,
}));

vi.mock("sonner", () => ({
  toast: {
    loading: vi.fn(() => "toast-id"),
    dismiss: vi.fn(),
    success: vi.fn(),
    error: vi.fn(),
  },
}));

vi.mock("axios", async (importOriginal) => {
  const actual = await importOriginal<typeof import("axios")>();

  return {
    ...actual,
    default: { ...actual.default, post: vi.fn() },
  };
});

const productDetails = {
  id: "product-1",
  title: "How was your experience?",
  message: "We read every message.",
};

function renderForm() {
  const store = createStore();
  store.set(ratingAtom, 4);

  render(
    <Provider store={store}>
      <ReviewForm productDetails={productDetails} />
    </Provider>
  );
}

async function fillAndSubmit() {
  const user = userEvent.setup();

  await user.type(screen.getByRole("textbox", { name: "Message" }), "Loved it");
  await user.type(screen.getByRole("textbox", { name: "Your name" }), "Jane");
  await user.type(
    screen.getByRole("textbox", { name: "Your email" }),
    "jane@example.com"
  );
  await user.click(screen.getByRole("button", { name: "Submit review" }));
}

describe("ReviewForm", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("shows the product title and message", () => {
    renderForm();

    expect(
      screen.getByRole("heading", { name: productDetails.title })
    ).toBeInTheDocument();
    expect(screen.getByText(productDetails.message)).toBeInTheDocument();
  });

  it("labels the star rating with the visible Rating label", () => {
    renderForm();

    expect(screen.getByRole("group", { name: "Rating" })).toBeInTheDocument();
  });

  it("marks the text fields as required and the photo as optional", () => {
    renderForm();

    for (const name of ["Message", "Your name", "Your email"]) {
      expect(screen.getByRole("textbox", { name })).toBeRequired();
    }
    expect(screen.getByText("(optional)")).toBeInTheDocument();
  });

  it("submits the entered values with the selected rating", async () => {
    vi.mocked(axios.post).mockResolvedValue({
      data: { success: true, message: "Review submitted" },
    });
    renderForm();

    await fillAndSubmit();

    expect(axios.post).toHaveBeenCalledWith("/api/reviews", {
      id: "product-1",
      message: "Loved it",
      customerName: "Jane",
      customerEmail: "jane@example.com",
      customerImage: "",
      rating: 4,
    });
    expect(toast.success).toHaveBeenCalledWith("Review submitted");
    expect(push).toHaveBeenCalledWith("product-1/submitted");
  });

  it("shows the server's error message and stays on the page", async () => {
    vi.mocked(axios.post).mockRejectedValue(
      new AxiosError("Bad Request", "400", undefined, undefined, {
        status: 400,
        statusText: "Bad Request",
        headers: {},
        config: { headers: new AxiosHeaders() },
        data: { success: false, message: "Invalid email address" },
      })
    );
    renderForm();

    await fillAndSubmit();

    expect(toast.error).toHaveBeenCalledWith("Invalid email address");
    expect(push).not.toHaveBeenCalled();
  });

  it("shows inline errors and skips the request when fields are empty", async () => {
    renderForm();

    await userEvent.click(
      screen.getByRole("button", { name: "Submit review" })
    );

    expect(screen.getByText("Message is required")).toBeInTheDocument();
    expect(screen.getByText("Name is required")).toBeInTheDocument();
    expect(screen.getByText("Invalid email address")).toBeInTheDocument();
    expect(screen.getByRole("textbox", { name: "Message" })).toHaveFocus();
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("links each error to its field", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(
      screen.getByRole("textbox", { name: "Message" }),
      "Loved it"
    );
    await user.type(screen.getByRole("textbox", { name: "Your name" }), "Jane");
    await user.type(
      screen.getByRole("textbox", { name: "Your email" }),
      "not-an-email"
    );
    await user.click(screen.getByRole("button", { name: "Submit review" }));

    const email = screen.getByRole("textbox", { name: "Your email" });

    expect(email).toHaveAttribute("aria-invalid", "true");
    expect(email).toHaveAccessibleDescription("Invalid email address");
    expect(email).toHaveFocus();
    expect(
      screen.getByRole("textbox", { name: "Message" })
    ).not.toHaveAttribute("aria-invalid");
    expect(screen.queryByText("Message is required")).not.toBeInTheDocument();
    expect(axios.post).not.toHaveBeenCalled();
  });

  it("clears a field's error once the user edits it", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.click(screen.getByRole("button", { name: "Submit review" }));
    await user.type(screen.getByRole("textbox", { name: "Your name" }), "J");

    expect(screen.queryByText("Name is required")).not.toBeInTheDocument();
    expect(screen.getByText("Message is required")).toBeInTheDocument();
  });

  it("shows a generic error for non-HTTP failures", async () => {
    vi.mocked(axios.post).mockRejectedValue(new Error("boom"));
    renderForm();

    await fillAndSubmit();

    expect(toast.error).toHaveBeenCalledWith("An unexpected error occurred");
    expect(push).not.toHaveBeenCalled();
  });
});
