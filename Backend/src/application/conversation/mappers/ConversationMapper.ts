import { IConversation } from "../../../domain/chat/entities/IConversation";
import { IUserConversation } from "../../../domain/chat/entities/IUserConversation";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { ConversationDTO } from "../dto/ConversationDTO";

export class ConversationMapper {
  static async toDomain(
    entity: IUserConversation,
    storageService: IStorageService
  ): Promise<ConversationDTO> {
    let signedUrl: string | null = null;
    if (entity.profileImage) {
      signedUrl = await storageService.generateSignedUrl(entity.profileImage);
    }
    return {
      id: entity.id,
      name: entity.name,
      profilImage: signedUrl,
      lastMessage: entity.lastMessage,
      lastMessageAt: entity.lastMessageAt,
      unread: entity.unread,
      doctorId: entity.doctorId,
      repId: entity.repId,
      repUserId: entity.repUserId,
      doctorUserId: entity.doctorUserId,
      lastMessageIsRead: entity.lastMessageIsRead,
      senderId: entity.senderId
    };
  }

  static async toDomainList(
    entity: IUserConversation[],
    storageService: IStorageService
  ): Promise<ConversationDTO[]> {
    return Promise.all(
      entity.map((conv) => this.toDomain(conv, storageService))
    );
  }

  static toEntity(
    repId: string,
    doctorId: string
  ): Omit<IConversation, "id" | "createdAt"> {
    return {
      doctorId: doctorId,
      repId: repId,
      lastMessageAt: new Date(),
    };
  }
}
