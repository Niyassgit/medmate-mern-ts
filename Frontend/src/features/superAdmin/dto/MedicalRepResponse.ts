import { MedicalRep } from "./MedicalRep";

export type MedicalRepResponse = {
  reps: MedicalRep[];
  page: number;
  total: number;
  limit: number;
};
