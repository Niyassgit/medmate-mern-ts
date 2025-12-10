import { z } from "zod";

export const GuestRegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Invalid phone number")
    .min(1, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  territoryId: z.string().optional(),
});

export type GuestRegisterBody = z.infer<typeof GuestRegisterSchema>;