import { IDoctorRepository } from "../../../domain/doctor/entities/IDoctorRepository";
import {Doctor} from "../../../domain/doctor/entities/Doctor";

export class GetDoctorProfileByEmailUseCase{

    constructor(private _doctorRepository:IDoctorRepository){}

    async execute(email:string):Promise<Doctor | null>{
        return this._doctorRepository.getDoctorByEmail(email);
    }
}