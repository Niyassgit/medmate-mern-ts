import { IConversationRepository } from "../../../domain/chat/respositories/IConversationRepository";
import { IMessageRepository } from "../../../domain/chat/respositories/IMessageRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { BadRequestError, UnautharizedError } from "../../errors";
import { IRepMessageMarkAsReadUseCase } from "../interfaces/IRepMessageMarkAsReadUseCase";

export class RepMessageMarkAsReadUseCase
  implements IRepMessageMarkAsReadUseCase
{
  constructor(
    private _medicalRepRepository: IMedicalRepRepository,
    private _conversationRepository: IConversationRepository,
    private _messageRepository: IMessageRepository
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
  }
}
