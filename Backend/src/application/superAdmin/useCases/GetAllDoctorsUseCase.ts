import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { DoctorListDTO } from "../dto/DoctorListDTO";
import { DoctorListMapper } from "../mappers/DoctorListMapper";

export class GetAllDoctorsUseCase {
  constructor(private _doctorRepository: IDoctorRepository) {}

  async execute(
    page: number,
    limit: number,
    search:string
  ): Promise<{ doctors: DoctorListDTO[]; total: number }> {
    const { doctors, total } = await this._doctorRepository.getAllDoctors(
      page,
      limit,
      search
    );
    return {
      doctors: doctors.map((doc) => DoctorListMapper.toDoctorListDTO(doc)),
      total,
    };
  }
}
