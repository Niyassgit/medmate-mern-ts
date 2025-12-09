import { BadRequestError, ConflictError } from "../../../domain/common/errors";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { INotificationService } from "../../../domain/common/services/INotificationService";
import { IOtpService } from "../../../domain/common/services/IOtpService";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";
import { IPatientRepository } from "../../../domain/Patient/repositories/IPatientRepositories";
import { Role } from "../../../shared/Enums";
import { ErrorMessages, NotificationMessages } from "../../../shared/Messages";
import { UserMapper } from "../../common/mapper/UserMapper";
import { RegisterRepResponseDTO } from "../../medicalRep/dto/RegisterRepResponseDTO";
import { RegisterPatientDTO } from "../dto/RegisterPatientDTO";
import { ICreatePatientUseCase } from "../interefaces/ICreatePatientUseCase";
import { PatientMapper } from "../mappers/PatientMapper";

export class CreatePatientUseCase implements ICreatePatientUseCase {
  constructor(
    private _userRepository: IUserRepository,
    private _patientRepository: IPatientRepository,
    private _bcryptService: IBcryptService,
    private _otpService: IOtpService,
    private _notificationService: INotificationService
  ) {}

  async execute(dto: RegisterPatientDTO): Promise<RegisterRepResponseDTO> {
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

    const patientEntity = PatientMapper.toPatientEntity(dto, user.id);
    await this._patientRepository.createPatient(patientEntity);

    const { otp, record } = await this._otpService.generateOtp(
      user.id,
      OtpPurpose.SIGNUP
    );

    void this._notificationService.sendEmail(
      dto.email,
      NotificationMessages.OTP_SUBJECT,
      NotificationMessages.OTP_VERIFICATION(otp)
    );

    return PatientMapper.toRegisterResponse(user, record?.expiredAt);
  }
}
