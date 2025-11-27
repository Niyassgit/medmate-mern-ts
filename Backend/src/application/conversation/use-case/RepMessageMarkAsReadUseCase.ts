import { IConversationRepository } from "../../../domain/chat/respositories/IConversationRepository";
import { IMessageRepository } from "../../../domain/chat/respositories/IMessageRepository";
import { IChatEventPublisher } from "../../../domain/common/services/IChatEventPublisher";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { BadRequestError, UnautharizedError } from "../../errors";
import { ConversationUpdateDTO } from "../dto/ConversationUpdateDTO";
import { IRepMessageMarkAsReadUseCase } from "../interfaces/IRepMessageMarkAsReadUseCase";

export class RepMessageMarkAsReadUseCase
  implements IRepMessageMarkAsReadUseCase
{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _conversationRepository: IConversationRepository,
    private _messageRepository: IMessageRepository,
    private _doctorRepository: IDoctorRepository,
    private _chatEventPublisher: IChatEventPublisher
  ) {}
  async execute(conversationId: string, userId?: string): Promise<void> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);
    if (!repId) throw new BadRequestError(ErrorMessages.USER_NOT_HAVE_PROFILE);
    const conversation =
      await this._conversationRepository.findConversationById(conversationId);
    if (!conversation)
      throw new BadRequestError(ErrorMessages.CONVERSATION_NOT_FOUND);
    await this._messageRepository.markAsRead(conversationId, repId);

    // Get the latest message to include in the update
    const messages = await this._messageRepository.getMessages(conversationId);
    const latestMessage = messages.length > 0 ? messages[messages.length - 1] : null;

    // Emit conversation update with unread count 0
    const { doctorUserId } = await this._doctorRepository.getUserIdByDoctorId(conversation.doctorId);
    const { repUserId } = await this._medicalRepRepository.getUserIdByRepId(conversation.repId);
    
    const conversationUpdate: ConversationUpdateDTO = {
      conversationId: conversationId,
      lastMessage: latestMessage?.content ?? "",
      lastMessageAt: latestMessage?.createdAt ?? new Date(),
      unread: 0,
    };
    
    await this._chatEventPublisher.publishConversationUpdate(
      doctorUserId,
      repUserId,
      conversationUpdate
    );
  }
}
