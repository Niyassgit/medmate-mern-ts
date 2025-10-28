export interface RegisterMedicalRepDTO {
  name: string;
  email: string;
  phone: string;
  password?: string;
  companyName: string;
  companyLogoUrl: string | null;
  employeeId: string;
  departmentId?: string;
  territories?:string[];
}
