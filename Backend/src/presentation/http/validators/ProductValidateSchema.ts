import { z } from "zod";

export const productValidateSchema = z.object({
  name: z.string().min(2, "Product name is required"),
  brand: z.string().min(2, "Brand is required"),
  mrp: z.coerce.number().positive("MRP must be a positive number"),
  ptr: z.coerce.number().positive("PTR must be a positive number"),
  territoryIds: z.array(z.string()).optional(),
  useCase: z.array(z.string()).optional(),
  ingredients: z.array(z.string()).optional(),
  imageUrls: z.array(z.string()).optional(),
}).passthrough(); // Allow additional fields like existingImages

export type ProductFormValues = z.infer<typeof productValidateSchema>;

