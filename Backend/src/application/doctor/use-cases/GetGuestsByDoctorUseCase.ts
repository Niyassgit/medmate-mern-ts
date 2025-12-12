import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IGuestRepository } from "../../../domain/Patient/repositories/IGuestRepositories";
import { ErrorMessages } from "../../../shared/Messages";
import { BadRequestError, UnautharizedError } from "../../errors";
import { IGetGuestsByDoctorUseCase } from "../interfaces/IGetGuestsByDoctorUseCase";

export class GetGuestsByDoctorUseCase implements IGetGuestsByDoctorUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _guestRepository: IGuestRepository
  ) {}

  async execute(userId?: string, search?: string): Promise<any[]> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(
      userId
    );
    if (!doctorId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);

    return await this._guestRepository.getGuestsByDoctorId(doctorId, search);
  }
}

