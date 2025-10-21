import { z } from "zod";

export const DepartmentSchema = z.object({
  name: z.string().min(2, "Department name is required"),
  isActive: z.boolean().default(false).optional(),
});

export type DepartmentSchemaDTO = z.infer<typeof DepartmentSchema>;
