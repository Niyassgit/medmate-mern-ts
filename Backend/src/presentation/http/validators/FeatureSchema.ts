import { z } from "zod";

export const CreateFeatureSchema = z.object({
  key: z
    .string()
    .min(3, "Feature key must be at least 3 characters")
    .max(50, "Feature key too long"),

  description: z
    .string()
    .min(5, "Description must be at least 5 characters")
    .max(200),
});

export type FeatureDTO = z.infer<typeof CreateFeatureSchema>;
