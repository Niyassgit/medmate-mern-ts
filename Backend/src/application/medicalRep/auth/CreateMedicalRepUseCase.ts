import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IBcryptService } from "../../../domain/common/services/IHashService";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";
import { Role } from "../../../domain/common/value-objects/Role";
import { RegisterMedicalRepDTO } from "../dto/RegisterMedicalRepDTO";
import { ConflictError, BadRequestError } from "../../../domain/common/errors";
import { IOtpService } from "../../../domain/common/services/IOtpService";
import { INotificationService } from "../../../domain/common/services/INotificationService";
import { RegisterRepResponseDTO } from "../dto/RegisterRepResponseDTO";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";
import { UserMapper } from "../../common/mapper/UserMapper";
import { MedicalRepMapper } from "../mapper/MedicalRepMapper";
import { MedicalRepAuthMapper } from "../mapper/MedicalRepAuthMapper";
import { ICreateMedicalRepUseCase } from "../interfaces/ICreateMedicalRepUseCase";

export class CreateMedicalRepUseCase implements ICreateMedicalRepUseCase{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _bcryptServices: IBcryptService,
    private _userLoginRepository: IUserRepository,
    private _otpService: IOtpService,
    private _notificationService: INotificationService
  ) {}

  async execute(data: RegisterMedicalRepDTO): Promise<RegisterRepResponseDTO> {
    const existingRep = await this._medicalRepRepository.getMedicalRepByEmail(
      data.email
    );
    if (existingRep) {
      throw new ConflictError(`User already exists`);
    }

    if (!data.password) {
      throw new BadRequestError("Password is required for signup");
    }
    const hashedPassword = await this._bcryptServices.hash(data.password);

    const userEntity = UserMapper.toUserEntity(
      data.email,
      hashedPassword,
      Role.MEDICAL_REP
    );
    const user = await this._userLoginRepository.createUser(userEntity);
    const logoUrl=data?data.companyLogoUrl:null;
    const medicalRepEntity = MedicalRepMapper.toMedicalRepEntity(data, user.id,logoUrl);

    await this._medicalRepRepository.createMedicalRep(medicalRepEntity);

    const { otp, record } = await this._otpService.generateOtp(
      user.id,
      OtpPurpose.SIGNUP
    );
    console.log("otp sended from rep register:", otp);
    this._notificationService
      .sendEmail(data.email, "Verify your account", `Your OTP is ${otp}`)
      .catch((err) => console.error("Failed to send OTP email:", err));
    return MedicalRepAuthMapper.toRegisterResponse(user, record?.expiredAt);
  }
}
