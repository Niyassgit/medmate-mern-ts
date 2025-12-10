import { BadRequestError, ConflictError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { INotificationService } from "../../../domain/common/services/INotificationService";
import { IOtpService } from "../../../domain/common/services/IOtpService";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";
import { IGuestRepository } from "../../../domain/Patient/repositories/IGuestRepositories";
import { Role } from "../../../shared/Enums";
import { ErrorMessages, NotificationMessages } from "../../../shared/Messages";
import { UserMapper } from "../../common/mapper/UserMapper";
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
    private _notificationService: INotificationService
  ) {}

  async execute(dto: RegisterGuestDTO): Promise<RegisterRepResponseDTO> {
    const existingUser = await this._userRepository.findByEmail(dto.email);
    if (existingUser) {
      throw new ConflictError(ErrorMessages.ACCOUNT_EXIST);
    }

    if (!dto.password) {
      throw new BadRequestError(ErrorMessages.PASSWORD_REQUIRED);
    }

    const hashedPassword = await this._bcryptService.hash(dto.password);

    const userEntity = UserMapper.toUserEntity(
      dto.email,
      hashedPassword,
      Role.GUEST
    );
    const user = await this._userRepository.createUser(userEntity);

    const guestEntity = GuestMapper.toGuestEntity(dto, user.id);
    await this._guestRepository.createGuest(guestEntity);

    const { otp, record } = await this._otpService.generateOtp(
      user.id,
      OtpPurpose.SIGNUP
    );

    void this._notificationService.sendEmail(
      dto.email,
      NotificationMessages.OTP_SUBJECT,
      NotificationMessages.OTP_VERIFICATION(otp)
    );

    return GuestMapper.toRegisterResponse(user, record?.expiredAt);
  }
}
