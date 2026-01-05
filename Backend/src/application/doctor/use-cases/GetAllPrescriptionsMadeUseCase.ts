import { BadRequestError, UnautharizedError } from "../../../domain/common/errors";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IPrescriptionRepository } from "../../../domain/prescription/repositories/IPrescriptionRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { PrescriptionDetailsDTO } from "../../guest/interefaces/PrescriptionDetailsDTO";
import { PrescriptionMapper } from "../../prescription/mappers/PrescriptionMapper";
import { IGetAllPrescriptionsMadeUseCase } from "../interfaces/IGetAllPrescriptionsMadeUseCase";

export class GetAllPresscriptionsMadeUseCase
  implements IGetAllPrescriptionsMadeUseCase
{
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _prescriptionRepository: IPrescriptionRepository,
    private _storageService: IStorageService
  ) {}
  async execute(userId?: string): Promise<PrescriptionDetailsDTO[]> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(
      userId
    );
    if (!doctorId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);

    const prescriptions =
      await this._prescriptionRepository.findAllPrescriptionByDoctorId(
        doctorId
      );

    return Promise.all(
      prescriptions.map((p) =>
        PrescriptionMapper.toDomain(p, this._storageService)
      )
    );
  }
}
