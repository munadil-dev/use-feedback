import { UPLOADCARE_PUBLIC_KEY } from "@/lib/constant/uploadcare.constant";

const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

// Uploads are temporary (store="false") until a review is saved, so photos
// from abandoned or edited forms expire on their own after 24 hours.
export async function storeUploadcareFile(cdnUrl: string) {
  const secretKey = process.env.UPLOADCARE_SECRET_KEY;
  const uuid = new URL(cdnUrl).pathname.split("/")[1];

  if (!secretKey || !UUID.test(uuid)) {
    console.error("Could not store review photo: ", cdnUrl);
    return;
  }

  try {
    const res = await fetch(
      `https://api.uploadcare.com/files/${uuid}/storage/`,
      {
        method: "PUT",
        headers: {
          Accept: "application/vnd.uploadcare-v0.7+json",
          Authorization: `Uploadcare.Simple ${UPLOADCARE_PUBLIC_KEY}:${secretKey}`,
        },
        signal: AbortSignal.timeout(5000),
      }
    );

    if (!res.ok) {
      console.error("Could not store review photo: ", res.status, uuid);
    }
  } catch (err) {
    console.error("Could not store review photo: ", err);
  }
}
