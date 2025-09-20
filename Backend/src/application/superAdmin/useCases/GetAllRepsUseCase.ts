import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { RepListDTO } from "../dto/RepListDTO";
import { RepListMapper } from "../mappers/RepListMapper";

export class GetAllRepsUseCase {
  constructor(private _medicalRepRepository: IMedicalRepRepository) {}

  async execute(
    page: number,
    limit: number,
    search:string,
  ): Promise<{ reps: RepListDTO[]; total: number }> {
    const { reps, total } = await this._medicalRepRepository.getAllMedicalReps(
      page,
      limit,
      search
    );
    return {
      reps: reps.map((rep) => RepListMapper.toRepListDTO(rep)),
      total,
    };
  }
}
