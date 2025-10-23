import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IMedicalRepWithUser } from "../../../domain/medicalRep/entities/IMedicalRepWithUser";
import { NetworkResponseDTO } from "../dto/NetworkResponseDTO";

export class NetworkMapper {
  static async toResponse(
    rep: IMedicalRepWithUser,
    storageService: IStorageService
  ): Promise<NetworkResponseDTO> {
    let signedUrl = null;
    if (rep.user?.profileImage) {
      signedUrl = await storageService.generateSignedUrl(rep.user.profileImage);
    }
    return {
      id: rep.id,
      name: rep.name,
      about: rep.about,
      profileImage: signedUrl || rep.user?.profileImage,
      companyName: rep.companyName,
    };
  }

  static async toResponselist(
    reps: IMedicalRepWithUser[],
    storageService: IStorageService
  ): Promise<NetworkResponseDTO[]> {
    return Promise.all(reps.map((r) => this.toResponse(r, storageService)));
  }
}
