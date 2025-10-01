import { Education } from "./Education";
import { Certificate } from "./Certificate";

export interface DoctorDetails {
  id: string;
  name: string;
  email: string | null;
  isBlocked: boolean | null;
  phone: string;
  hasOwnClinic: boolean | null;
  hospital: string;
  registrationId: string;
  opHours: string | null;
  about: string;

  educations?: Education[];
  certificates?: Certificate[];
  profileImage: string;
}
