import {
  NotFoundError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { Role } from "../../../shared/Enums";
import { IGetRepsListForPracticeUseCase } from "../interfaces/IGetRepsListForPracticeUseCase";
import { RepListForPracticeDTO } from "../dto/RepListForPracticeDTO";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";

export class GetRepsListForPracticeUseCase
  implements IGetRepsListForPracticeUseCase
{
  constructor(
    private _userRepository: IUserRepository,
    private _doctorRepository: IDoctorRepository,
    private _connectionRepository: IConnectionRepository,
    private _storageService: IStorageService
  ) {}

  async execute(userId?: string): Promise<RepListForPracticeDTO[]> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const user = await this._userRepository.findById(userId);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    if (user.role !== Role.DOCTOR)
      throw new UnautharizedError(ErrorMessages.DOCTOR_ACCESS);

    const doctor = await this._doctorRepository.getDoctorByUserId(userId);
    if (!doctor) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);

    const connectedReps =
      await this._connectionRepository.doctorMutualConnections(doctor.id);

    return Promise.all(
      connectedReps.map(async (rep) => {
        let signedImageUrl: string | null = null;
        if (rep.image) {
          signedImageUrl = await this._storageService.generateSignedUrl(
            rep.image
          );
        }

        return {
          id: rep.id,
          name: rep.name,
          company: rep.company,
          phone: rep.phone,
          image: signedImageUrl,
          departmentId: rep.departmentId,
          departmentName: rep.departmentName,
        };
      })
    );
  }
}
