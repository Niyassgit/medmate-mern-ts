import { BadRequestError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IGuestRepository } from "../../../domain/Patient/repositories/IGuestRepositories";
import { Role } from "../../../shared/Enums";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { IChangePasswordUseCase } from "../interfaces/IChangePasswordUseCase";

export class ChangePasswordUseCase implements IChangePasswordUseCase {
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _doctorRepository: IDoctorRepository,
    private _guestRespository: IGuestRepository,
    private _userRepository: IUserRepository,
    private _bcryptService: IBcryptService
  ) {}
  async execute(
    role: Role,
    newPassword: string,
    userId?: string
  ): Promise<string> {
    let profileId: string | null = null;
    if (!userId) throw new BadRequestError(ErrorMessages.UNAUTHORIZED);
    switch (role) {
      case Role.DOCTOR: {
        const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(
          userId
        );
        profileId = doctorId;
        break;
      }

      case Role.MEDICAL_REP: {
        const { repId } = await this._medicalRepRepository.getRepIdByUserId(
          userId
        );
        profileId = repId;
        break;
      }

      case Role.GUEST: {
        const { guestId } = await this._guestRespository.findGuestIdByUserId(
          userId
        );
        profileId = guestId;
        break;
      }

      default:
        throw new BadRequestError(ErrorMessages.UNAUTHORIZED);
    }

    if (!profileId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    const hashedPassword = await this._bcryptService.hash(newPassword);
    const changed = await this._userRepository.resetPassword(
      userId,
      hashedPassword
    );
    if (!changed) return ErrorMessages.PASSWORD_UNABLE_TO_CHANGE;
    return SuccessMessages.PASSWORD_RESET_SUCCESS;
  }
}
