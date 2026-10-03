// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { storeUploadcareFile } from "./uploadcare";

const uuid = "0f7c2b5e-1d3a-4c8b-9e6f-2a4b6c8d0e1f";
const cdnUrl = `https://ifkueqi105.ucarecd.net/${uuid}/`;
const mockFetch = vi.fn();

describe("storeUploadcareFile", () => {
  beforeEach(() => {
    vi.stubGlobal("fetch", mockFetch);
    vi.stubEnv("UPLOADCARE_SECRET_KEY", "secret");
    vi.spyOn(console, "error").mockImplementation(() => {});
    mockFetch.mockReset().mockResolvedValue(new Response(null));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
  });

  it("stores the file with the secret key", async () => {
    await storeUploadcareFile(cdnUrl);

    expect(mockFetch).toHaveBeenCalledWith(
      `https://api.uploadcare.com/files/${uuid}/storage/`,
      expect.objectContaining({
        method: "PUT",
        headers: expect.objectContaining({
          Authorization: "Uploadcare.Simple bcfc6ab51fbdad37a21b:secret",
        }),
      })
    );
  });

  it("reads the file id from a URL with modifiers", async () => {
    await storeUploadcareFile(`${cdnUrl}-/preview/100x100/`);

    expect(mockFetch.mock.calls[0][0]).toBe(
      `https://api.uploadcare.com/files/${uuid}/storage/`
    );
  });

  it("skips the request when the secret key is missing", async () => {
    vi.stubEnv("UPLOADCARE_SECRET_KEY", "");

    await storeUploadcareFile(cdnUrl);

    expect(mockFetch).not.toHaveBeenCalled();
    expect(console.error).toHaveBeenCalled();
  });

  it("skips the request when the URL has no file id", async () => {
    await storeUploadcareFile("https://ucarecdn.com/not-a-file/");

    expect(mockFetch).not.toHaveBeenCalled();
  });

  it.each([
    [
      "an error status",
      () => mockFetch.mockResolvedValue(new Response(null, { status: 503 })),
    ],
    [
      "a network error",
      () => mockFetch.mockRejectedValue(new Error("offline")),
    ],
  ])("logs instead of throwing on %s", async (_, fail) => {
    fail();

    await expect(storeUploadcareFile(cdnUrl)).resolves.toBeUndefined();
    expect(console.error).toHaveBeenCalled();
  });
});
