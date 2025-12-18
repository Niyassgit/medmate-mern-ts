import { ConflictError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { INotificationService } from "../../../domain/common/services/INotificationService";
import { IOtpService } from "../../../domain/common/services/IOtpService";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";
import { IGuestRepository } from "../../../domain/Patient/repositories/IGuestRepositories";
import { IPrescriptionRepository } from "../../../domain/prescription/repositories/IPrescriptionRepository";
import { Role } from "../../../shared/Enums";
import { ErrorMessages, NotificationMessages } from "../../../shared/Messages";
import { UserMapper } from "../../common/mapper/UserMapper";
import { BadRequestError } from "../../errors";
import { RegisterRepResponseDTO } from "../../medicalRep/dto/RegisterRepResponseDTO";
import { RegisterGuestDTO } from "../dto/RegisterPatientDTO";
import { ICreateGuestUseCase } from "../interefaces/ICreateGuestUseCase";
import { GuestMapper } from "../mappers/GuestMapper";

export class CreateGuestUseCase implements ICreateGuestUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _guestRepository: IGuestRepository,
    private _bcryptService: IBcryptService,
    private _otpService: IOtpService,
    private _notificationService: INotificationService,
    private _prescriptionRepository: IPrescriptionRepository
  ) {}

  async execute(dto: RegisterGuestDTO): Promise<RegisterRepResponseDTO> {

    if (!dto.password) {
      throw new BadRequestError(ErrorMessages.PASSWORD_REQUIRED);
    }
    const existingGuest = await this._guestRepository.findByEmailId(dto.email);
    const existingUser = await this._userRepository.findByEmail(dto.email);
    if (
      existingUser &&
      (!existingGuest || existingGuest.userId !== existingUser.id)
    ) {
      throw new ConflictError(ErrorMessages.ACCOUNT_EXIST);
    }

    if (dto.shareToken) {
      const prescription =
        await this._prescriptionRepository.findPrescriptionByShareToken(
          dto.shareToken
        );

      if (!prescription) {
        throw new BadRequestError(ErrorMessages.INVALID_INVITATION_LINK);
      }

      if (existingGuest && prescription.guestId !== existingGuest.id) {
        throw new BadRequestError(ErrorMessages.INVALID_INVITATION_LINK);
      }
    }

    let user = existingUser;
    if (!user) {
      const hashedPassword = await this._bcryptService.hash(dto.password);
      const userEntity = UserMapper.toUserEntity(
        dto.email,
        hashedPassword,
        Role.GUEST
      );
      user = await this._userRepository.createUser(userEntity);
   
    }

    if (existingGuest) {
      await this._guestRepository.updateGuest(existingGuest.id, {
        userId:user.id,
        isRegistered: true,
        name: dto.name,
        phone: dto.phone,
        territoryId: dto.territoryId ?? existingGuest.territoryId,
      });
    } else {
      const guestEntity = GuestMapper.toGuestEntity(dto, user.id);
      await this._guestRepository.createGuest(guestEntity);
    }

    const { otp, record } = await this._otpService.generateOtp(
      user.id,
      OtpPurpose.SIGNUP
    );
 
    console.log("otp sended:",otp)
    void this._notificationService.sendEmail(
      dto.email,
      NotificationMessages.OTP_SUBJECT,
      NotificationMessages.OTP_VERIFICATION(otp)
    );

    return GuestMapper.toRegisterResponse(user, record?.expiredAt);
  }
}
