import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { DistributionDTO } from "../dto/UserDistributionDTO";
import { IGetUserDistributionUseCase } from "../interfaces/IGetUserDistributionUseCase";
import { UnautharizedError } from "../../errors";
import { ErrorMessages } from "../../../shared/Messages";
import { getDateRange } from "../../../shared/DateRange";

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

    const {parsedStartDate,parsedEndDate}=getDateRange(startDate,endDate);
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
