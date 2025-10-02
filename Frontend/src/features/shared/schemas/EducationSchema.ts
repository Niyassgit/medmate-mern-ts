import {z} from "zod";

export const  EducationSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institute: z.string().min(1, "Institute is required"),
  year: z.number().nullable().optional(),
});
export type EducationDTO = z.infer<typeof EducationSchema>;