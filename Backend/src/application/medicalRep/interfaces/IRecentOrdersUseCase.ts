import { OrderTableDTO } from "../dto/OrderTableDTO";

export interface IRecentOrdersUseCase{
    execute(userId?:string):Promise<OrderTableDTO[]>;
}