
import { DoctorDetailsDTO } from "../dto/DoctorDetailsDTO";
import { IDoctorWithUser } from "../../../domain/doctor/entities/IDoctorWithLogin";
import { MedicalRepDetailsDTO } from "../dto/MedicalRepDetailsDTO";
import { IMedicalRepWithUser } from "../../../domain/doctor/entities/IMedicalRepWithUser";

export class UserDetailsMapper{
    static toDoctorDetails(doctor:IDoctorWithUser):DoctorDetailsDTO{
        return{
          id:doctor.id,
          name:doctor.name,
          phone:doctor.phone,
          email:doctor.user?.email ?? null,
          hospital:doctor.hospital,
          hasOwnClinic:doctor.hasOwnClinic ?? null,
          isBlocked:doctor.user?.isBlocked ?? null,
          licenseImageUrl:doctor.licenseImageUrl ?? null,
          opHours:doctor.opHours ?? null,
          registrationId:doctor.registrationId  
        }
    }

    static toMedicalRepDetails(rep:IMedicalRepWithUser):MedicalRepDetailsDTO{
      return{
         id:rep.id,
         name:rep.name,
         email:rep.user?.email ?? null,
         phone:rep.phone,
         companyName:rep.companyName,
         companyLogoUrl:rep.companyLogoUrl ?? null,
         employeeId:rep.employeeId ?? null,
         isBlocked:rep.user?.isBlocked ?? null,
         maxConnectionsPerDay:rep.maxConnectionsPerDay ?? null,
         subscriptionStatus:rep.subscriptionStatus ?? null,

      }
    }
    

}