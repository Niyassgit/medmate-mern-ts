import { IMessage } from "../../../domain/chat/entities/IMessage";
import { CreateMessageDTO } from "../dto/CreateMessageDTO";
import { MessageResponseDTO } from "../dto/MessageResponseDTO";

export class MessageMapper{
    static toDomain(entity:IMessage):MessageResponseDTO{

        return {
            id:entity.id,
            content:entity.content,
            conversationId:entity.conversationId,
            createdAt:entity.createdAt,
            isRead:entity.isRead,
            messageType:entity.messageType,
            senderId:entity.senderId,
            senderRole:entity.senderRole
        }
    }

    static toDomainList(entity:IMessage[]):MessageResponseDTO[]{
        return entity.map((e)=>this.toDomain(e));
    }
    static toEntity(dto:CreateMessageDTO,senderId:string):Omit<IMessage,"id" | "createdAt"| "isRead">{
        return{
            content:dto.content,
            conversationId:dto.conversationId,
            messageType:dto.messageType,
            senderId:senderId,
            senderRole:dto.senderRole,
        }
    }
}