import { IGuestListItem } from "../../../domain/Patient/entities/IGuestListItem";

export interface IGetGuestsByDoctorUseCase {
  execute(userId?: string, search?: string): Promise<IGuestListItem[]>;
}

