export interface IMedicalRepListOnDoc {
  id: string;
  name: string;
  image: string | null;
  company: string;
  phone: string | null;
  departmentId: string | null;
  departmentName?: string;
}
