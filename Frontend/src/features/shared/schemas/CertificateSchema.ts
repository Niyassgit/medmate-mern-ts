import {z} from "zod";

export  const CertificateSchema = z.object({
  name: z.string().min(1, "Certificate name is required"),
  issuedBy: z.string().nullable().optional(),
  year: z.number().nullable().optional(),
});
export type CertificateDTO = z.infer<typeof CertificateSchema>;