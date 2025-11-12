import { IMedicalRepWithUser } from "../../../domain/medicalRep/entities/IMedicalRepWithUser";

export class MedicalRepFilterService {
  static apply(
    reps: IMedicalRepWithUser[],
    search?: string,
  ): IMedicalRepWithUser[] {
    let filtered = [...reps];

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(term) ||
          doc.departmentName?.toLowerCase().includes(term)
      );
    }
    return filtered;
}
}