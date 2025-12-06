import { IMedicalRepWithUser } from "../../../domain/medicalRep/entities/IMedicalRepWithUser";

export class MedicalRepFilterService {
  static apply(
    reps: IMedicalRepWithUser[],
    search?: string,
    filters?: {
      company?: string;
      territories?: string[];
    }
  ): IMedicalRepWithUser[] {
    let filtered = [...reps];

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (rep) =>
          rep.name.toLowerCase().includes(term) ||
          rep.departmentName?.toLowerCase().includes(term) ||
          rep.companyName?.toLowerCase().includes(term)
      );
    }

    if (filters?.company) {
      const company = filters.company.toLowerCase();
      filtered = filtered.filter(
        (rep) => rep.companyName?.toLowerCase() === company
      );
    }

    if (filters?.territories && filters.territories.length > 0) {
      filtered = filtered.filter((rep) =>
        rep.territories?.some((t) => filters.territories?.includes(t))
      );
    }

    return filtered;
  }
}