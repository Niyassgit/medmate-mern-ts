import { MessageType, Role } from "../../../shared/Enums";

export interface IMessage{
    id:string;
    conversationId:string;
    senderId:string;
    senderRole:Role,
    content:string | null;
    messageType:MessageType;
    isRead:boolean;
    createdAt:Date;
}