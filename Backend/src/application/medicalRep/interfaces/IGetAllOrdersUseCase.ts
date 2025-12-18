import { RepOrderDTO } from "../dto/RepOrderDTO";

export interface IGetAllOrdersUseCase{
    execute(userId?:string):Promise<RepOrderDTO[]>;
}