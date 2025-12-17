import { CreateGuestByDoctorDTO } from "../dto/CreateGuestByDoctorDTO";

export interface ICreateGuestByDoctorUseCase {
  execute(dto: CreateGuestByDoctorDTO,userId?: string): Promise<string>;
}

