import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IDepartmentRepository } from "../../../domain/department/repositories/IDepartmentRepository";
import { IDoctorListOnRep } from "../../../domain/doctor/entities/IDoctorListOnRep";
import { IMedicalRepListOnDoc } from "../../../domain/medicalRep/entities/IMedicalRepListOnDoc";
import { ITerritoryRepository } from "../../../domain/territory/ITerritoryRepository";
import { RepListOnDoctorDTO } from "../../doctor/dto/RepListOnDoctorDTO";
import { DoctorListOnRepDTO } from "../../medicalRep/dto/DoctorListOnRepDTO";

export class ConnectionMappers {
  static toRepDomainAnaltics(entity: IDoctorListOnRep): DoctorListOnRepDTO {
    return {
      id: entity.id,
      name: entity.name,
      hospital: entity.hospital,
      specialty: entity.departmentName ?? null,
      territory: entity.territoryName ?? null,
      image: entity.image,
    };
  }
  static toRepDomainAnalticsList(
    entities: IDoctorListOnRep[]
  ): DoctorListOnRepDTO[] {
    return entities.map((doc) => this.toRepDomainAnaltics(doc));
  }

  static toDoctorDomainAnaltics(
    enitity: IMedicalRepListOnDoc
  ): RepListOnDoctorDTO {
    return {
      id: enitity.id,
      name: enitity.name,
      company: enitity.company,
      phone: enitity.phone ?? null,
      speciality: enitity.departmentName ?? null,
      image: enitity.image ?? null,
    };
  }
  static toDoctorDomainAnalticsList(
    entities: IMedicalRepListOnDoc[]
  ): RepListOnDoctorDTO[] {
    return entities.map((rep) => this.toDoctorDomainAnaltics(rep));
  }

  static enrichConnectionsForRep(
    connections: IDoctorListOnRep[],
    departmentRepo: IDepartmentRepository,
    territoryRepo: ITerritoryRepository,
    storageService: IStorageService
  ) {
    return Promise.all(
      connections.map(async (doctor) => {
        const department = doctor.departmentId
          ? await departmentRepo.getDepartmentName(
              doctor.departmentId
            )
          : null;
        const territory = doctor.territoryId
          ? await territoryRepo.getTerritoryName(doctor.territoryId)
          : null;
        const profileImage = doctor.image
          ? await storageService.generateSignedUrl(doctor.image)
          : null;
        return {
          ...doctor,
          departmentName: department ?? "",
          territoryName: territory ?? "",
          image: profileImage,
        };
      })
    );
  }
   
  static enrichConnectionForDoctor(connections:IMedicalRepListOnDoc[],departmentRepo:IDepartmentRepository,storageService:IStorageService){
    return Promise.all(
         connections.map(async (rep) => {
        const department = rep.departmentId
          ? await departmentRepo.getDepartmentName(rep.departmentId)
          : null;
        const profileImage=rep.image ? await storageService.generateSignedUrl(rep.image):null;
        return {
          ...rep,
          departmentName: department ?? "",
          image:profileImage,
        };
      })
    )
  }
}
