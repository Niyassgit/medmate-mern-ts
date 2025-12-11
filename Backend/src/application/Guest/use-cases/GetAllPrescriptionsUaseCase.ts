import {
  BadRequestError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IGuestRepository } from "../../../domain/Patient/repositories/IGuestRepositories";
import { IPrescriptionItemRepository } from "../../../domain/prescription/repositories/IPrescriptionItemRepository";
import { IPrescriptionRepository } from "../../../domain/prescription/repositories/IPrescriptionRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { IGetAllPrescriptionsUseCase } from "../interefaces/IGetAllPrescriptions";
import { PrescriptionDetailsDTO } from "../interefaces/PrescriptionDetailsDTO";

export class GetAllPrescriptionsUseCase implements IGetAllPrescriptionsUseCase {
  constructor(
    private _guestRepository: IGuestRepository,
    private _prescriptionRepository: IPrescriptionRepository,
    private _prescriptionItemRepository:IPrescriptionItemRepository,
  ) {}
  async execute(userId?: string): Promise<PrescriptionDetailsDTO[]> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { guestId } = await this._guestRepository.findGuestIdByUserId(userId);
    if (!guestId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    const prescriptions =
      await this._prescriptionRepository.findAllPrescriptionsByGuestId(guestId);
     

  }
}
