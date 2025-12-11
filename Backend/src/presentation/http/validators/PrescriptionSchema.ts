import { z } from "zod";
import { PrescriptionStatus } from "@prisma/client";

const PrescriptionItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  dosage: z.string().optional(),
  quantity: z.number().int().positive().default(1),
});

// Helper to transform string dates to Date objects
// Handles: ISO date strings, Date objects, empty strings, and undefined
const dateStringSchema = z.preprocess(
  (val) => {
    if (!val || val === "" || val === null) return undefined;
    if (val instanceof Date) return val;
    if (typeof val === "string") {
      const date = new Date(val);
      return isNaN(date.getTime()) ? undefined : date;
    }
    return undefined;
  },
  z.date().optional()
);

export const PrescriptionSchema = z.object({
  notes: z.string().optional(),
  status: z.nativeEnum(PrescriptionStatus).optional(),
  expiresAt: dateStringSchema,
  shareToken: z.string().optional(),
  linkExpiresAt: dateStringSchema,
  items: z.array(PrescriptionItemSchema).min(1, "At least one prescription item is required"),
});

export type CreatePrescriptionSchema = z.infer<typeof PrescriptionSchema>;
