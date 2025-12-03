import { ChatResponseDTO } from "../dto/ChatResponseDTO";

export interface IGetAllMessagesUseCase{
    execute(conversationId:string,cursor?:string):Promise<ChatResponseDTO>;
}