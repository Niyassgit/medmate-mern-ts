import { CreateMessageDTO } from "../dto/CreateMessageDTO";
import { MessageDTO } from "../dto/MessageDTO";

export interface ICreateRepMessageUseCase{
    execute(data:CreateMessageDTO,userId?:string):Promise<MessageDTO>;
}