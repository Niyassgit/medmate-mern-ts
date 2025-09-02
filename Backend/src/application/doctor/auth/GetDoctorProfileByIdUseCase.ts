import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import {IDoctor} from "../../../domain/doctor/entities/IDoctor";


export class GetDoctorProfileByIdUseCase{
    constructor(private _doctorRepository:IDoctorRepository){}

    async execute(id:string):Promise<IDoctor | null>{
            return this._doctorRepository.getDoctorById(id);
    }
}