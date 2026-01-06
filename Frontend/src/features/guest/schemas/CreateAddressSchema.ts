import { z } from "zod";
import { AddressType } from "@/types/AddressType";

export const AddressSchema = z.object({
  type: z.enum([AddressType.HOME, AddressType.WORK, AddressType.OTHER]),
  fullName: z.string().min(1, "Full name is required"),
  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits")
    .max(15, "Phone number too long"),
  street: z.string().min(1, "Street address is required"),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "Zip/Pincode must be at least 5 digits"),
  country: z.string().min(1, "Country is required"),
  landmark: z.string().optional(),
});

export type AddressSchemaDTO = z.infer<typeof AddressSchema>;
