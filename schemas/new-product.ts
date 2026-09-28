import { z } from "zod";

export const newProductSchema = z.object({
  name: z.string().trim().min(1, "Product name is required"),
  title: z.string().trim().min(1, "Title is required"),
  message: z.string().trim().min(1, "Message is required"),
});

export type NewProductType = z.infer<typeof newProductSchema>;
