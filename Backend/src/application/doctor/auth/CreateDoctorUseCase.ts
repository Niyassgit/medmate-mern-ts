import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { RegisterResponseDTO } from "../dto/RegisterResponseDTO";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { RegisterDoctorDTO } from "../dto/RegisterDoctorDTO";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { Role } from "../../../shared/Enums";
import { ConflictError, BadRequestError } from "../../../domain/common/errors";
import { INotificationService } from "../../../domain/common/services/INotificationService";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";
import { IOtpService } from "../../../domain/common/services/IOtpService";
import { DoctorAuthMapper } from "../mapper/DoctorAuthMapper";
import { DoctorMapper } from "../mapper/DoctorMapper";
import { UserMapper } from "../../common/mapper/UserMapper";
import { ICreateDoctorUseCase } from "../interfaces/ICreateDoctorUseCase";
import { ErrorMessages, NotificationMessages } from "../../../shared/Messages";
import { getOpSession } from "../utils/OpSessionUtil";

export class CreateDoctorUseCase implements ICreateDoctorUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _bcryptServices: IBcryptService,
    private _userRepository: IUserRepository,
    private _otpService: IOtpService,
    private _notificationService: INotificationService
  ) {}

  async execute(data: RegisterDoctorDTO): Promise<RegisterResponseDTO> {
    const userExist = await this._doctorRepository.getDoctorByEmail(data.email);
    if (userExist) throw new ConflictError(ErrorMessages.ACCOUNT_EXIST);

    if (!data.password)
      throw new BadRequestError(ErrorMessages.PASSWORD_REQUIRED);

    const hashedPassword = await this._bcryptServices.hash(data.password);

    const userEntity = UserMapper.toUserEntity(
      data.email,
      hashedPassword,
      Role.DOCTOR
    );
    const user = await this._userRepository.createUser(userEntity);
    const opSession=getOpSession(data.opStartTime,data.opEndTime);
    const doctorEntity = DoctorMapper.toDoctorEntity(data, user.id,opSession);
    await this._doctorRepository.createDoctor(doctorEntity);

    const { otp, record } = await this._otpService.generateOtp(
      user.id,
      OtpPurpose.SIGNUP
    );
    console.log("otp sended to user:", otp);
    void this._notificationService.sendEmail(
      data.email,
      NotificationMessages.OTP_SUBJECT,
      NotificationMessages.OTP_VERIFICATION(otp)
    );
    
    return DoctorAuthMapper.toRegisterResponse(user, record?.expiredAt);
  }
}
