import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import axios, { AxiosError, AxiosHeaders } from "axios";
import { createStore, Provider } from "jotai";
import { toast } from "sonner";
import { beforeEach, describe, expect, it, vi } from "vitest";
import FeedbackForm from "./feedback-form";
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
  name: "UseFeedback",
  title: "How was your experience?",
  message: "We read every message.",
  userId: "user-1",
};

function renderForm() {
  const store = createStore();
  store.set(ratingAtom, 4);

  render(
    <Provider store={store}>
      <FeedbackForm productDetails={productDetails} />
    </Provider>
  );
}

async function fillAndSubmit() {
  const user = userEvent.setup();

  await user.type(screen.getByLabelText("Message"), "Loved it");
  await user.type(screen.getByLabelText("Your name"), "Jane");
  await user.type(screen.getByLabelText("Your email"), "jane@example.com");
  await user.click(screen.getByRole("button", { name: "Submit feedback" }));
}

describe("FeedbackForm", () => {
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

  it("submits the entered values with the selected rating", async () => {
    vi.mocked(axios.post).mockResolvedValue({
      data: { success: true, message: "Feedback submitted" },
    });
    renderForm();

    await fillAndSubmit();

    expect(axios.post).toHaveBeenCalledWith("/api/feedback/create", {
      id: "product-1",
      message: "Loved it",
      customerName: "Jane",
      customerEmail: "jane@example.com",
      customerImage: "",
      rating: 4,
    });
    expect(toast.success).toHaveBeenCalledWith("Feedback submitted");
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

  it("shows a generic error for non-HTTP failures", async () => {
    vi.mocked(axios.post).mockRejectedValue(new Error("boom"));
    renderForm();

    await fillAndSubmit();

    expect(toast.error).toHaveBeenCalledWith("An unexpected error occurred");
    expect(push).not.toHaveBeenCalled();
  });
});
