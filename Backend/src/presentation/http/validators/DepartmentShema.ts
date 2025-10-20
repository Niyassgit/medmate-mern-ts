import {z} from "zod";

export const DepartmentSchema=z.object({
    name:z.string().min(3,"Department name must be at least 3 characters"),
    isActive:z.boolean().optional().default(false),
});

export type DepartmentSchemaDTO=z.infer<typeof DepartmentSchema>;
