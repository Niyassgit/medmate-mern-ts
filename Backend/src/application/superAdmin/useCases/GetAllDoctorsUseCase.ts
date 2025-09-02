import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { DoctorListDTO } from "../dto/DoctorListDTO";
import { DoctorListMapper } from "../mappers/DoctorListMapper";

export class GetAllDoctorsUseCase{

    constructor(
        private _doctorRepository:IDoctorRepository
    ){}
    
    async execute():Promise<DoctorListDTO[]>{

        const doctors=await this._doctorRepository.getAllDoctors();
        return doctors.map((doc)=>DoctorListMapper.toDoctorListDTO(doc));
    }

}