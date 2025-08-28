import { IDoctorRepository } from "../../../domain/doctor/entities/IDoctorRepository";
import {IDoctor} from "../../../domain/doctor/entities/IDoctor";

export class GetDoctorProfileByEmailUseCase{

    constructor(private _doctorRepository:IDoctorRepository){}

    async execute(email:string):Promise<IDoctor | null>{
        return this._doctorRepository.getDoctorByEmail(email);
    }
}