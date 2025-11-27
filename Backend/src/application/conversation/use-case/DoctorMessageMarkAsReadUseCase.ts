import { IConversationRepository } from "../../../domain/chat/respositories/IConversationRepository";
import { IMessageRepository } from "../../../domain/chat/respositories/IMessageRepository";
import { UnautharizedError } from "../../../domain/common/errors";
import { IChatEventPublisher } from "../../../domain/common/services/IChatEventPublisher";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { BadRequestError } from "../../errors";
import { ConversationUpdateDTO } from "../dto/ConversationUpdateDTO";
import { IDoctorMessageMarkAsReadUseCase } from "../interfaces/IDoctorMessageMarkAsReadUseCase";

export class DoctoMessageMarkAsReadUseCase
  implements IDoctorMessageMarkAsReadUseCase
{
  constructor(
    private _doctorRepository:IDoctorRepository,
    private _messageRepository:IMessageRepository,
    private _conversationRepository:IConversationRepository,
    private _medicalRepRepository: IMedicalRepRepository,
    private _chatEventPublisher: IChatEventPublisher
  ) {}
  async execute(conversationId: string, userId?: string): Promise<void> {
     if(!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
     const {doctorId}=await this._doctorRepository.getDoctorIdByUserId(userId);
     if(!doctorId) throw new BadRequestError(ErrorMessages.USER_NOT_HAVE_PROFILE);
     const conversation=await this._conversationRepository.findConversationById(conversationId);
     if(!conversation) throw new BadRequestError(ErrorMessages.CONVERSATION_NOT_FOUND);
     await this._messageRepository.markAsRead(conversationId,doctorId);

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
