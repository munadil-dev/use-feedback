import { z } from "zod";

export const newProductSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, "Product name is required")
    .max(100, "Product name must be 100 characters or fewer"),
  title: z
    .string()
    .trim()
    .min(1, "Page title is required")
    .max(150, "Page title must be 150 characters or fewer"),
  message: z
    .string()
    .trim()
    .min(1, "Message is required")
    .max(500, "Message must be 500 characters or fewer"),
});

export type NewProductType = z.infer<typeof newProductSchema>;
