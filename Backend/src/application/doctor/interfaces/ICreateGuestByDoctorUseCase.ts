import { IGuest } from "../../../domain/Guest/entities/IGuest";
import { CreateGuestByDoctorDTO } from "../dto/CreateGuestByDoctorDTO";

export interface ICreateGuestByDoctorUseCase {
  execute(dto: CreateGuestByDoctorDTO, userId?: string): Promise<IGuest>;
}

