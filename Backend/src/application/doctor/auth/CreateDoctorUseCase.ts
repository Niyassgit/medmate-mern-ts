import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { RegisterResponseDTO } from "../dto/RegisterResponseDTO";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { RegisterDoctorDTO } from "../dto/RegisterDoctorDTO";
import { IUserRepository } from "../../../domain/common/repositories/IUserLoginRepository";
import { Role } from "../../../domain/common/entities/IUser";
import { ConflictError, BadRequestError } from "../../../domain/common/errors";
import { INotificationService } from "../../../domain/common/services/INotificationService";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";
import { IOtpService } from "../../../domain/common/services/IOtpService";
import { DoctorAuthMapper } from "../mapper/DoctorAuthMapper";
import { DoctorMapper } from "../mapper/DoctorMapper";
import { UserMapper } from "../../common/mapper/UserMapper";

export class CreateDoctorUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _bcryptServices: IBcryptService,
    private _userRepository: IUserRepository,
    private _otpService: IOtpService,
    private _notificationService: INotificationService
  ) {}

  async execute(data: RegisterDoctorDTO): Promise<RegisterResponseDTO> {
    const userExist = await this._doctorRepository.getDoctorByEmail(data.email);
    if (userExist) throw new ConflictError(`User already exists`);

    if (!data.password)
      throw new BadRequestError("Password is requred for signup");

    const hashedPassword = await this._bcryptServices.hash(data.password);

    const userEntity = UserMapper.toUserEntity(
      data.email,
      hashedPassword,
      Role.DOCTOR
    );
    const user = await this._userRepository.createUser(userEntity);

    const doctorEntity = DoctorMapper.toDoctorEntity(data, user.id);
    await this._doctorRepository.createDoctor(doctorEntity);

    const { otp, record } = await this._otpService.generateOtp(
      user.id,
      OtpPurpose.SIGNUP
    );
    console.log("otp sended to user:", otp);
    this._notificationService
      .sendEmail(data.email, "Veryfy your account", `Your OTP is ${otp}`)
      .catch((err) => console.error("Failed to send OTP email:", err));

    return DoctorAuthMapper.toRegisterResponse(user, record?.expiredAt);
  }
}
