import { z } from "zod";
import { PrescriptionStatus } from "@prisma/client";

const PrescriptionItemSchema = z.object({
  productId: z.string().min(1, "Product ID is required"),
  dosage: z.string().optional(),
  quantity: z.number().int().positive().default(1),
});

export const PrescriptionSchema = z.object({
  notes: z.string().optional(),
  status: z.nativeEnum(PrescriptionStatus).optional(),
  expiresAt: z.string().datetime().optional().or(z.date().optional()),
  shareToken: z.string().optional(),
  linkExpiresAt: z.string().datetime().optional().or(z.date().optional()),
  items: z.array(PrescriptionItemSchema).min(1, "At least one prescription item is required"),
});

export type CreatePrescriptionSchema = z.infer<typeof PrescriptionSchema>;
