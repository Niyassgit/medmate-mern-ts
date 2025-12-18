import { z } from "zod";

export const GuestRegisterSchema = z.object({
  name: z
    .string()
    .min(3, "Name must be at least 3 characters long")
    .max(50, "Name must be less than 50 characters"),
  email: z.string().email("Invalid email format"),
  phone: z
    .string()
    .min(10, "Phone number must be at least 10 digits")
    .max(15, "Phone number must be at less than 15 digits"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number")
    .regex(/[\W_]/, "Password must contain at least one special character"),
  territoryId: z.string().optional(),
});

export const CompleteProfileSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters long"),
  phone: z.string().min(10, "Phone number must be at least 10 digits"),
  territoryId: z.string().min(1, "Territory is required"),
});