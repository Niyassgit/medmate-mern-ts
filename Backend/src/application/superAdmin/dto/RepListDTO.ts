export interface RepListDTO {
  id: string;
  name: string;
  email: string | null;
  phone: string;
  subscriptionStatus: boolean | null;
  isBlocked: boolean | null;
  employeeId: string | null;
  createdAt: Date | null;
  loginId: string | null;
  territoryNames: string[];
}
