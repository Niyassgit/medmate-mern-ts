import { z } from "zod";

export const RegisterGuestSchema = z
  .object({
    name: z.string().min(1, "Name is required"),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(/^\+?\d{10,15}$/, "Invalid phone number")
      .min(1, "Phone number is required"),
    password: z.string().min(6, "Password must be at least 6 characters"),
    Cpassword: z.string().min(6, "Confirm your password"),
    territoryId: z.string().optional(),
  })
  .refine((data) => data.password === data.Cpassword, {
    message: "Passwords do not match",
    path: ["Cpassword"],
  });

export type RegisterGuestBody = z.infer<typeof RegisterGuestSchema>;