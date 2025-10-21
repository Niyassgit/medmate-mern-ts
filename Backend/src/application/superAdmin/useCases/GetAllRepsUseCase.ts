import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { RepsListResponseDTO } from "../dto/RepsListResponseDTO";
import { IGetAllRepsUseCase } from "../interfaces/IGetAllRespsUseCase";
import { RepListMapper } from "../mappers/RepListMapper";

export class GetAllRepsUseCase implements IGetAllRepsUseCase {
  constructor(private _medicalRepRepository: IMedicalRepRepository) {}

  async execute(
    page: number,
    limit: number,
    search: string
  ): Promise<RepsListResponseDTO> {
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
