import {z} from "zod";

export const productPostSchema = z.object({
  title: z.string().min(2, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  brand: z.string().min(2, "Brand is required"),
  territory: z.string().optional(),
  termsOfUse: z.string().min(10, "Terms & Conditions are required"),
});

export type ProductPostFormValues = z.infer<typeof productPostSchema>;