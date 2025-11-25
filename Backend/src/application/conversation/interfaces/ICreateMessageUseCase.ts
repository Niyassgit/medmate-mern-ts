import { CreateMessageDTO } from "../dto/CreateMessageDTO";
import { MessageResponseDTO } from "../dto/MessageResponseDTO";

export interface ICreateMessageUseCase{
    execute(data:CreateMessageDTO,userId?:string):Promise<MessageResponseDTO>;
}