import { GooglePrecheckResultDTO } from "../dto/GooglePrecheckResultDTO";


export interface IGooglePrecheckUseCase{
    execute(idToken:string):Promise<GooglePrecheckResultDTO>
}