export const UPLOADCARE_PUBLIC_KEY = "bcfc6ab51fbdad37a21b";

// Uploadcare file ids are UUIDs and always the first segment of a CDN URL path.
export const UPLOADCARE_FILE_ID =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
