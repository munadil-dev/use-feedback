import { z } from "zod";

export const newFeedbackSchema = z.object({
  id: z.string("Product is required").min(1, "Product is required"),
  message: z.string().trim().min(1, "Message is required"),
  customerName: z.string().trim().min(1, "Name is required"),
  customerEmail: z.email("Invalid email address"),
  customerImage: z.string().optional(),
  rating: z
    .int("Rating must be a whole number")
    .min(1, "Rating must be between 1 and 5")
    .max(5, "Rating must be between 1 and 5"),
});
