import { IConversationRepository } from "../../../domain/chat/respositories/IConversationRepository";
import { IMessageRepository } from "../../../domain/chat/respositories/IMessageRepository";
import { UnautharizedError } from "../../../domain/common/errors";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { BadRequestError } from "../../errors";
import { IDoctorMessageMarkAsReadUseCase } from "../interfaces/IDoctorMessageMarkAsReadUseCase";

export class DoctoMessageMarkAsReadUseCase
  implements IDoctorMessageMarkAsReadUseCase
{
  constructor(
    private _doctorRepository:IDoctorRepository,
    private _messageRepository:IMessageRepository,
    private _conversationRepository:IConversationRepository,
  ) {}
  async execute(conversationId: string, userId?: string): Promise<void> {
     if(!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
     const {doctorId}=await this._doctorRepository.getDoctorIdByUserId(userId);
     if(!doctorId) throw new BadRequestError(ErrorMessages.USER_NOT_HAVE_PROFILE);
     const conversation=await this._conversationRepository.findConversationById(conversationId);
     if(!conversation) throw new BadRequestError(ErrorMessages.CONVERSATION_NOT_FOUND);
     await this._messageRepository.markAsRead(conversationId,doctorId);
  }
}
