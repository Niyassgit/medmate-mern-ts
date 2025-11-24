import { IMessage } from "../entities/IMessage";

export interface IMessageRepository{
    getMessages(conversationId:string):Promise<IMessage[]>;
    create(message:Omit<IMessage,"id" | "createdAt" | "isRead">):Promise<IMessage>;
    markAsRead(conversationId:string,userId:string):Promise<void>;
}