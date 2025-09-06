import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { DoctorListDTO } from "../dto/DoctorListDTO";
import { DoctorListMapper } from "../mappers/DoctorListMapper";

export class GetAllDoctorsUseCase{

    constructor(
        private _doctorRepository:IDoctorRepository
    ){}
    
    async execute(page:number,limit:number):Promise<DoctorListDTO[]>{

        const doctor=await this._doctorRepository.getAllDoctors(page,limit);
        return doctor.doctors.map((doc)=>DoctorListMapper.toDoctorListDTO(doc));
    }

}