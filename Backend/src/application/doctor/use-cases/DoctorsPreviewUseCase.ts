import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { DoctorPreviewForGuestDTO } from "../dto/DoctorPreviewForGuestDTO";
import { IDoctorsPreviewUseCase } from "../interfaces/IDoctorsPreviewCardUseCase";
import { DoctorMapper } from "../mapper/DoctorMapper";

export class DoctorsPreviewUseCase implements IDoctorsPreviewUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _sotrageService: IStorageService
  ) {}
  async execute(): Promise<DoctorPreviewForGuestDTO[]> {
    const doctors = await this._doctorRepository.getDoctorsForGuest();
    const mapped = await Promise.all(
      doctors.map((d) => DoctorMapper.forGuest(d, this._sotrageService))
    );
    return mapped;
  }
}
