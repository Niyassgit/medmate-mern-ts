import { IMessage } from "../entities/IMessage";

export interface IMessageRepository{
    getMessages(conversationId:string, cursor?:string | null):Promise<IMessage[]>;
    createMessage(message:Omit<IMessage,"id" | "createdAt" | "isRead">):Promise<IMessage>;
    markAsRead(conversationId:string,profileId:string):Promise<void>;
}