import { MessageResponseDTO } from "../dto/MessageResponseDTO";

export interface IGetAllMessagesUseCase{
    execute(conversationId:string):Promise<MessageResponseDTO[]>;
}