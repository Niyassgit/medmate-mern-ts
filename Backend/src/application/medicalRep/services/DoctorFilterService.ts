import { IDoctorWithUser } from "../../../domain/doctor/entities/IDoctorWithUser";

export class DoctorFilterService {
  static apply(
    doctors: IDoctorWithUser[],
    search?: string,
    filters?: { opTime?: string; minAge?: number; maxAge?: number }
  ): IDoctorWithUser[] {
    let filtered = [...doctors];

    if (search) {
      const term = search.toLowerCase();
      filtered = filtered.filter(
        (doc) =>
          doc.name.toLowerCase().includes(term) ||
          doc.departmentName?.toLowerCase().includes(term)
      );
    }

    if (filters?.opTime && filters.opTime !== "any") {
      const time = filters.opTime.toLowerCase();
      filtered = filtered.filter((doc) =>
        doc.opSession?.toLowerCase().includes(time)
      );
    }

    if (filters?.minAge !== undefined && filters?.maxAge !== undefined) {
      const minAge = Number(filters.minAge);
      const maxAge = Number(filters.maxAge);

      const currentYear = new Date().getFullYear();
      filtered = filtered.filter((doc) => {
        if (!doc.dob) return false;
        const age = currentYear - new Date(doc.dob).getFullYear();
        return age >= minAge && age <= maxAge;
      });
    }

    return filtered;
  }
}
