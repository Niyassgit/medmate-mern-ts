import { IUser } from "../../../domain/common/entities/IUser";
import { NotificationMessages } from "../../../shared/Messages";
import { RegisterResponseDTO } from "../../doctor/dto/RegisterResponseDTO";
import { RegisterGuestDTO } from "../dto/RegisterPatientDTO";
import { IGuest } from "../../../domain/Patient/entities/IGuest";

export class GuestMapper {
  static toGuestEntity(
    dto: RegisterGuestDTO,
    loginId: string
  ): Omit<IGuest, "id" | "createdAt" | "updatedAt"> {
    return {
      name: dto.name,
      email: dto.email,
      phone: dto.phone,
      userId: loginId,
      isRegistered: true,
      doctorId: null,
      territoryId: dto.territoryId || null,
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
