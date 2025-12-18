import z from "zod";

export const profileSchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z
    .string()
    .regex(/^[0-9]+$/, "Phone number must be digits")
    .min(10, "Phone number must be at least 10 digits"),
  territoryId: z.string().min(1, "Territory is required"),
});

export type IFormInput = z.infer<typeof profileSchema>;