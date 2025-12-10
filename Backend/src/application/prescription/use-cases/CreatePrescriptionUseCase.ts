import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IPrescriptionRepository } from "../../../domain/prescription/repositories/IPrescriptionRepository";
import { IPrescriptionItemRepository } from "../../../domain/prescription/repositories/IPrescriptionItemRepository";
import { ErrorMessages, SuccessMessages } from "../../../shared/Messages";
import { BadRequestError, UnautharizedError } from "../../errors";
import { PrescriptionDTO } from "../dto/PrescriptionDTO";
import { ICreatePrescriptionUseCase } from "../interfaces/ICreatePrescriptionUseCase";
import { PrescriptionMapper } from "../mappers/PrescriptionMapper";

export class CreatePrescriptionUseCase implements ICreatePrescriptionUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _prescriptionRepository: IPrescriptionRepository,
    private _prescriptionItemRepository: IPrescriptionItemRepository
  ) {}
  async execute(
    guestId: string,
    dto: PrescriptionDTO,
    userId?: string
  ): Promise<string> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    
    if (!dto.items || dto.items.length === 0) {
      throw new BadRequestError(ErrorMessages.PRESCRIPTION_ITEM_NEEDED);
    }

    const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(
      userId
    );
    if (!doctorId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    
    const mappedData = PrescriptionMapper.toEntity(dto, doctorId, guestId);
    const prescription = await this._prescriptionRepository.createPrescription(
      mappedData
    );
    if (!prescription) throw new BadRequestError(ErrorMessages.OPERATION_FAILE);
    
    const prescriptionItems = dto.items.map((item) =>
      PrescriptionMapper.toPrescriptionItemEntity(item, prescription.id)
    );
    
    await this._prescriptionItemRepository.createPrescriptionItems(
      prescriptionItems
    );
    
    return SuccessMessages.PRESCRIPTION_CREATED;
  }
}
