export interface RepListForPracticeDTO {
  id: string;
  name: string;
  company: string;
  phone: string | null;
  image: string | null; // Signed URL
  departmentId: string | null;
  departmentName?: string;
}

