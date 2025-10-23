import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IDoctorWithUser } from "../../../domain/doctor/entities/IDoctorWithUser";
import { DoctorNetworkCardDTO } from "../dto/DocrtorNetworkCardDTO";

export class NetworkMapper {
  static async toResponse(
    doc: IDoctorWithUser,
    storageService: IStorageService
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
    };
  }

  static async toResponseList(
    doc: IDoctorWithUser[],
    storageService: IStorageService
  ): Promise<DoctorNetworkCardDTO[]> {
    return Promise.all(doc.map((d) => this.toResponse(d, storageService)));
  }
}
