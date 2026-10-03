import { z } from "zod";

// Uploadcare serves each project from <prefix>.ucarecd.net (ucarecdn.com for older projects).
const uploadcareImage = z.url({
  protocol: /^https$/,
  hostname: /^([a-z0-9]+\.ucarecd\.net|ucarecdn\.com)$/,
  error: "Upload the photo again",
});

export const newReviewSchema = z.object({
  id: z.string("Product is required").min(1, "Product is required"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(1000, "Message must be 1000 characters or fewer"),
  customerName: z
    .string()
    .trim()
    .min(1, "Name is required")
    .max(100, "Name must be 100 characters or fewer"),
  customerEmail: z.email("Invalid email address").max(254),
  customerImage: z.union([z.literal(""), uploadcareImage]).optional(),
  rating: z
    .int("Rating must be a whole number")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
});
