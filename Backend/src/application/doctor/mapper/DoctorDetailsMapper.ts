import { IDoctorWithUser } from "../../../domain/doctor/entities/IDoctorWithLogin"
import { DoctorDetailsDTO } from "../dto/DoctorDetailsDTO"

export class DoctorDetailsMapper{
    
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
}