import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { DistributionDTO } from "../dto/UserDistributionDTO";
import { IGetUserDistributionUseCase } from "../interfaces/IGetUserDistributionUseCase";
import { UnautharizedError } from "../../errors";
import { ErrorMessages } from "../../../shared/Messages";

export class GetUserDistributionUseCase implements IGetUserDistributionUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _medicalRepRepository: IMedicalRepRepository
  ) {}

  async execute(
    userId?: string,
    startDate?: string,
    endDate?: string
  ): Promise<DistributionDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    let parsedStartDate: Date | undefined;
    let parsedEndDate: Date | undefined;

    if (startDate || endDate) {
      parsedStartDate = startDate ? new Date(startDate) : undefined;
      parsedEndDate = endDate ? new Date(endDate) : undefined;
    } else {
      const now = new Date();
      parsedStartDate = new Date(now.getFullYear(), 0, 1); 
      parsedEndDate = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    }

    const doctors = await this._doctorRepository.countDoctors(
      parsedStartDate,
      parsedEndDate
    );

    const reps = await this._medicalRepRepository.countReps(
      parsedStartDate,
      parsedEndDate
    );

    return {
      doctors,
      reps,
    };
  }
}
