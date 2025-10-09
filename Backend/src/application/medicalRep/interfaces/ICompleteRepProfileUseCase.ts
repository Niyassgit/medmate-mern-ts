import { CompleteRepProfileDTO } from "../dto/CompleteRepProfileDTO";

export interface ICompleteRepProfileUseCase{
    execute(userId:string,data:CompleteRepProfileDTO,file:Express.Multer.File| null):Promise<string>;
}