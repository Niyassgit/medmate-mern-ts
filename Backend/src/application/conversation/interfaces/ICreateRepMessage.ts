import { CreateMessageDTO } from "../dto/CreateMessageDTO";
import { MessageResponseDTO } from "../dto/MessageResponseDTO";

export interface ICreateRepMessageUseCase{
    execute(data:CreateMessageDTO,userId?:string):Promise<MessageResponseDTO>;
}