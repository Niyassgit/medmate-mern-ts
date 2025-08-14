import { IDoctorRepository } from "../../../domain/doctor/entities/IDoctorRepository";
import {Doctor} from "../../../domain/doctor/entities/Doctor";
import { BcryptServices } from "../../../infrastructure/security/BcryptService";
import { RegisterDoctorDTO } from "../../../domain/doctor/dto/RegisterDoctorDTO";

export class CreateDoctorUseCase{

    constructor(private doctorRepository:IDoctorRepository,private bcryptService:BcryptServices){}

    async execute(data:RegisterDoctorDTO):Promise<Doctor>{
        const existingDoctor=await this.doctorRepository.getDoctorByEmail(data.email);
        if(existingDoctor){
            throw new Error("Doctor with this email already exists");
        }
        if(!data.password){
            throw new Error("Password is Required for signup");
        }
        const hashedPassword= await this.bcryptService.hashPassword(data.password);

        return this.doctorRepository.createDoctor({
            ...data,
            password:hashedPassword
        });
    }
}