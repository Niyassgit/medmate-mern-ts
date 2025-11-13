import { RepDetailsResponseOnDoctorDTO } from "../dto/RepDetailsResponseOnDoctorDTO";

export interface IGetRepDetailsOnDoctorUseCase{
    execute(repId:string,userId?:string):Promise<RepDetailsResponseOnDoctorDTO>;
}