export interface RepDTO {
  id: string;
  name: string;
  company: string;
  phone: string | null;
  image: string | null;
  departmentId: string | null;
  departmentName?: string;
}