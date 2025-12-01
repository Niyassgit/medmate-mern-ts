import { z } from "zod";

export const subscriptionPlanSchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().min(1, "Description is required"),
  price: z.number().positive("Price must be greater than 0"),
  tenure: z.string().min(1, "Tenure is required"),
  features: z.string().min(1, "Features are required"),
  reps: z.array(z.string().optional()).optional(), 
});

export type CertificateDTO = z.infer<typeof subscriptionPlanSchema>;
