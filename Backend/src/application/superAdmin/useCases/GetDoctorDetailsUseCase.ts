import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { NotFoundError } from "../../errors";
import { DoctorDetailsDTO } from "../../doctor/dto/DoctorDetailsDTO";
import { DoctorDetailsMapper } from "../../doctor/mapper/DoctorDetailsMapper";
import { IGetDoctorDetailsUseCase } from "../interfaces/IGetDoctorDetailsUseCase";
import { ErrorMessages } from "../../../shared/Messages";

export class GetDoctorDetailsUseCase implements IGetDoctorDetailsUseCase {
  constructor(private _doctorRepository: IDoctorRepository) {}

  async execute(userId: string): Promise<DoctorDetailsDTO | null> {
    const user = await this._doctorRepository.getDoctorById(userId);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    return DoctorDetailsMapper.toDoctorDetails(user);
  }
}
