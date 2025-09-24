export interface UpdateMedicalRepDTO {
  name?: string;
  phone?: string;
  companyName?: string;
  companyLogoUrl?: string | null;
  employeeId?: string | null;
  departmentId?: string | null;
  about?: string | null;
  subscriptionPlanId?: string | null;
  subscriptionStatus?: string | null;
  subscriptionStart?: Date | null;
  subscriptionEnd?: Date | null;
  maxConnectionsPerDay?: number;
}
