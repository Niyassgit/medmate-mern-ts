import { ConversationDTO } from "../dto/ConversationDTO";

export interface IGetConversationsUseCase{
    execute(userId?:string):Promise<ConversationDTO[]>;
}