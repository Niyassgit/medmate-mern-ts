import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { UserGrowthDTO } from "../dto/UserGrowthDTO";
import { IGetUserGrowthUseCase } from "../interfaces/IGetUserGrowthUseCase";
import { UnautharizedError } from "../../errors";
import { ErrorMessages } from "../../../shared/Messages";

export class GetUserGrowthUseCase implements IGetUserGrowthUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _medicalRepRepository: IMedicalRepRepository
  ) {}

  async execute(userId?: string, year?: string): Promise<UserGrowthDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const targetYear = year ? parseInt(year) : new Date().getFullYear();

    const doctorGrowth = await this._doctorRepository.getMonthlyDoctorGrowth(targetYear);
    const repGrowth = await this._medicalRepRepository.getMonthlyRepGrowth(targetYear);

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    const months: string[] = [];
    const doctors: number[] = [];
    const reps: number[] = [];

    for (let i = 0; i < 12; i++) {
      months.push(monthNames[i]);
      doctors.push(doctorGrowth[i]?.count || 0);
      reps.push(repGrowth[i]?.count || 0);
    }

    return {
      months,
      doctors,
      reps,
    };
  }
}

