import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { DoctorsListResponseDTO } from "../dto/DocrtorsListResponseDTO";
import { IGetAllDoctorsUseCase } from "../interfaces/IGetAllDoctorsUseCase";
import { DoctorListMapper } from "../mappers/DoctorListMapper";

export class GetAllDoctorsUseCase implements IGetAllDoctorsUseCase {
  constructor(private _doctorRepository: IDoctorRepository) {}

  async execute(
    page: number,
    limit: number,
    search: string,
    territory?: string
  ): Promise<DoctorsListResponseDTO> {
    const { doctors, total } = await this._doctorRepository.getAllDoctors(
      page,
      limit,
      search,
      territory
    );
    return {
      doctors: doctors.map((doc) => DoctorListMapper.toDoctorListDTO(doc)),
      total,
    };
  }
}
