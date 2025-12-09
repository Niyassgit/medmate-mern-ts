import { z } from "zod";

// Backend schema - only validates fields sent from frontend (Cpassword is validated on frontend only)
export const PatientRegisterSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Invalid phone number")
    .min(1, "Phone number is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

export type PatientRegisterBody = z.infer<typeof PatientRegisterSchema>;