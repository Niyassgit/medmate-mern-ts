import { z } from "zod";

export const registerMedicalRepSchema = z.object({
  name: z.string().min(1, "name is required"),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^\+?\d{10,15}$/, "Invalid phone number")
    .optional(),
  password: z
    .string()
    .min(6, "Password must be atleast 6 characters")
    .optional(),
  companyName: z.string().min(1),
  companyLogoUrl: z.any(),
  employeeId: z.string().min(1, "Employee Id required"),
  territories: z
    .array(z.string().min(1))
    .min(1, "At least one territory is required"),

  departmentId: z.string().min(1, "Department is required"),
});
