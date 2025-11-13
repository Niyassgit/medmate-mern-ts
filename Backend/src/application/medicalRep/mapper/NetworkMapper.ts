import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IDoctorWithUser } from "../../../domain/doctor/entities/IDoctorWithUser";
import { DoctorNetworkCardDTO } from "../dto/DocrtorNetworkCardDTO";

export class NetworkMapper {
  static async toResponse(
    doc: IDoctorWithUser,
    storageService: IStorageService,
    connectionStatus: string | null = null,
    connectionInitiator: string | null = null
  ): Promise<DoctorNetworkCardDTO> {
    let signedUrl = null;
    if (doc.user?.profileImage) {
      signedUrl = await storageService.generateSignedUrl(doc.user.profileImage);
    }
    return {
      id: doc.id,
      name: doc.name,
      department: doc.departmentName ?? null,
      hospitalName: doc.hospital,
      profileImage: signedUrl || doc.user?.profileImage,
      institution:
        doc.educations && doc.educations.length > 0
          ? `${doc.educations[0].degree} - ${doc.educations[0].institute}`
          : null,
      speciality: doc.departmentName ?? null,
      territory: doc.territoryName ?? null,
      schedule: doc.opSession ?? null,
      connectionStatus,
      connectionInitiator,
    };
  }

  static async toResponseList(
    doc: IDoctorWithUser[],
    storageService: IStorageService
  ): Promise<DoctorNetworkCardDTO[]> {
    return Promise.all(doc.map((d) => this.toResponse(d, storageService)));
  }
}
