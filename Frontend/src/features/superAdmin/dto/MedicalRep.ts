export interface MedicalRep {
  id: string;
  name: string;
  email: string;
  phone: string;
  subscriptionStatus: boolean;
  isBlocked: boolean;
  employeeId: string;
  createdAt: Date;
  loginId: string;
  territoryNames: string[];
}