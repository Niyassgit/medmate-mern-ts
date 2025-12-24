import { IUser } from "../../../domain/common/entities/IUser";
import { NotificationMessages } from "../../../shared/Messages";
import { RegisterResponseDTO } from "../../doctor/dto/RegisterResponseDTO";
import { RegisterGuestDTO } from "../dto/RegisterPatientDTO";
import { IGuest } from "../../../domain/guest/entities/IGuest";
import { GuestProfileCompleteDTO } from "../dto/ProfileCompleteDTO";
import { GuestListDTO } from "../../superAdmin/dto/GuestListDTO";
import { CreateGuestByDoctorDTO } from "../../doctor/dto/CreateGuestByDoctorDTO";

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

  static toEntity(
    data: GuestProfileCompleteDTO,
    email: string,
    userId: string
  ): Omit<IGuest, "id" | "createdAt" | "updatedAt"> {
    return {
      name: data.name,
      isRegistered: true,
      doctorId: "",
      phone: data.phone,
      territoryId: data.territoryId,
      email: email,
      userId: userId,
    };
  }

  static toDomain(data: IGuest): GuestListDTO {
    return {
      id: data.id,
      email: data.email ?? null,
      createdAt: data.createdAt,
      isBlocked: data.isRegistered,
      loginId: data.userId ?? null,
      name: data.name,
      phone: data.phone ?? null,
      territory: data.territoryId ?? null,
    };
  }

  static toGuestEntityByDoctor(
    dto: CreateGuestByDoctorDTO,
    doctorId: string
  ): Omit<IGuest, "id" | "createdAt" | "updatedAt"> {
    return {
      name: dto.name,
      email: dto.email || null,
      phone: dto.phone || undefined,
      userId: null,
      doctorId: doctorId,
      territoryId: dto.territoryId || null,
      isRegistered: false,
    };
  }
}
