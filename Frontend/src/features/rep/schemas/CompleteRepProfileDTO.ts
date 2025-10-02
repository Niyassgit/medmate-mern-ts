import { z } from "zod";

export const CompleteRepProfileSchema = z.object({
  name: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Phone number is required"),
  companyName: z.string().optional(),
  employeeId: z.string().optional(),
  about: z.string().optional(),
  companyLogoUrl: z.any(),  
});

export type CompleteRepProfileDTO = z.infer<typeof CompleteRepProfileSchema>;
