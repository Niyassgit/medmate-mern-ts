import { IDoctorListOnRep } from "../../../domain/doctor/entities/IDoctorListOnRep";
import { IMedicalRepListOnDoc } from "../../../domain/medicalRep/entities/IMedicalRepListOnDoc";
import { RepListOnDoctorDTO } from "../../doctor/dto/RepListOnDoctorDTO";
import { DoctorListOnRepDTO } from "../../medicalRep/dto/DoctorListOnRepDTO";

export class ConnectionMappers{
    static toRepDomainAnaltics(entity:IDoctorListOnRep):DoctorListOnRepDTO{
        return{
            id:entity.id,
            name:entity.name,
            hospital:entity.hospital,
            specialty:entity.departmentName ?? null,
            territory:entity.territoryName ?? null
        }
    }
    static toRepDomainAnalticsList(entities:IDoctorListOnRep[]):DoctorListOnRepDTO[]{
        return entities.map((doc)=>this.toRepDomainAnaltics(doc));
    }

    static toDoctorDomainAnaltics(enitity:IMedicalRepListOnDoc):RepListOnDoctorDTO{
        return {
            id:enitity.name,
            name:enitity.name,
            company:enitity.company,
            phone:enitity.phone ?? null,
            speciality:enitity.departmentName?? null,
            image:enitity.image ?? null,
        }
    }
    static toDoctorDomainAnalticsList(entities:IMedicalRepListOnDoc[]):RepListOnDoctorDTO[]{
        return entities.map((rep)=>this.toDoctorDomainAnaltics(rep));
    }
}