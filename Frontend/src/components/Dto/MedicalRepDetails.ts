import { Education } from "./Education";
import { Certificate } from "./Certificate";
export interface MedicalRepDetails {
  id: string;
  name: string;
  email: string;
  phone: string;
  companyName: string;
  companyLogoUrl: string;
  employeeId: string;
  isBlocked: boolean;
  maxConnectionsPerDay: number;
  subscriptionStatus: boolean;
  about: string;
  profileImage: string;
  educations?: Education[];
  certificates?: Certificate[];
}
