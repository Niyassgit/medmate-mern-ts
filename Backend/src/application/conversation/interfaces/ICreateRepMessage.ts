import { CreateMessageDTO } from "../dto/CreateMessageDTO";
import { MessageResponseDTO } from "../dto/MessageDTO";

export interface ICreateRepMessageUseCase{
    execute(data:CreateMessageDTO,userId?:string):Promise<MessageResponseDTO>;
}