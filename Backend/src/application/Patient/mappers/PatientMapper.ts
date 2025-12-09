import { IUser } from "../../../domain/common/entities/IUser";
import { NotificationMessages } from "../../../shared/Messages";
import { RegisterResponseDTO } from "../../doctor/dto/RegisterResponseDTO";
import { RegisterPatientDTO } from "../dto/RegisterPatientDTO";
import { IPatient } from "../../../domain/Patient/entities/IPatient";

export class PatientMapper {
  static toPatientEntity(
    dto: RegisterPatientDTO,
    loginId: string
  ): Omit<IPatient, "id" | "createdAt" | "updatedAt"> {
    return {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      userId: loginId,
      isRegistered: true,
      doctorId: null,
    };
  }

  static toRegisterResponse(
    user: IUser,
    expiredAt?: Date
  ): RegisterResponseDTO {
    return {
      email: user.email,
      loginId: user.id,
      isVerified: user.isVerified,
      message: NotificationMessages.REGISTER_SUCCESS,
      role: user.role,
      expiredAt,
      otplength: 6,
    };
  }
}
