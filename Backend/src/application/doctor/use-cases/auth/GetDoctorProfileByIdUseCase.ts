import { IDoctorRepository } from "../../../../domain/doctor/entities/IDoctorRepository";
import {Doctor} from "../../../../domain/doctor/entities/Doctor";


export class GetDoctorProfileByIdUseCase{
    constructor(private doctorRepository:IDoctorRepository){}

    async execute(id:string):Promise<Doctor | null>{
            return this.doctorRepository.getDoctorById(id);
    }
}