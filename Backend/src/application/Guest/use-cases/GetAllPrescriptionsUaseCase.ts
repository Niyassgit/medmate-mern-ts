import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IGuestRepository } from "../../../domain/Patient/repositories/IGuestRepositories";
import { IPrescriptionRepository } from "../../../domain/prescription/repositories/IPrescriptionRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { PrescriptionMapper } from "../../prescription/mappers/PrescriptionMapper";
import { IGetAllPrescriptionsUseCase } from "../interefaces/IGetAllPrescriptions";
import { PrescriptionDetailsDTO } from "../interefaces/PrescriptionDetailsDTO";

export class GetAllPrescriptionsUseCase implements IGetAllPrescriptionsUseCase {
  constructor(
    private _guestRepository: IGuestRepository,
    private _prescriptionRepository: IPrescriptionRepository,
    private _storageService: IStorageService
  ) {}
  async execute(userId?: string): Promise<PrescriptionDetailsDTO[]> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { guestId } = await this._guestRepository.findGuestIdByUserId(userId);
    if (!guestId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    const prescriptions =
      await this._prescriptionRepository.findAllPrescriptionsByGuestId(guestId);

    return Promise.all(
      prescriptions.map((p) =>
        PrescriptionMapper.toDomain(p, this._storageService)
      )
    );
  }
}
