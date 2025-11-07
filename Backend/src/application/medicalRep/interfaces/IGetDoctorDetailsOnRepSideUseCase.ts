import { DoctorDetailsOnRepDTO } from "../dto/DoctorDetailsOnRepDTO";

export interface IGetDoctorDetailsOnRepSideUseCase{
    execute(doctorId:string,userId?:string):Promise<DoctorDetailsOnRepDTO>;
}