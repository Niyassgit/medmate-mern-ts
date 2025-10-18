import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { UserProfileDTO } from "../../common/dto/UserProfileDTO";
import { UserMapper } from "../../common/mapper/UserMapper";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { NotFoundError } from "../../errors";
import { DoctorDetailsDTO } from "../dto/DoctorDetailsDTO";
import { IGetDoctorProfileByIdUseCase } from "../interfaces/IGetDoctoraProfileByIdUseCase";
import { DoctorDetailsMapper } from "../mapper/DoctorDetailsMapper";

export class GetDoctorProfileByIdUseCase
  implements IGetDoctorProfileByIdUseCase
{
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _userRepository: IUserRepository,
    private _storageService: IStorageService
  ) {}
  async execute(
    userId: string
  ): Promise<DoctorDetailsDTO | UserProfileDTO | null> {
    const doctor = await this._doctorRepository.getDoctorByUserId(userId);
    if (!doctor) {
      const user = await this._userRepository.findById(userId);
      if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
      const profileImageUrl = user.profileImage
        ? await this._storageService.generateSignedUrl(user.profileImage)
        : null;
      return UserMapper.toUserProfile(user, profileImageUrl);
    }
    const profileImageKey = doctor.user?.profileImage;
    const profileImageUrl = profileImageKey
      ? await this._storageService.generateSignedUrl(profileImageKey)
      : null;

    return DoctorDetailsMapper.toDoctorDetails(doctor, profileImageUrl);
  }
}
