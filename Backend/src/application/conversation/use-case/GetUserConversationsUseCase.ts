import { IConversationRepository } from "../../../domain/chat/respositories/IConversationRepository";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { BadRequestError, UnautharizedError } from "../../errors";
import { ConversationDTO } from "../dto/ConversationDTO";
import { IGetConversationsUseCase } from "../interfaces/IGetUserConversationsUseCase";
import { ConversationMapper } from "../mappers/ConversationMapper";

export class GetUserConversationsUseCase implements IGetConversationsUseCase {
  constructor(
    private _conversationRepository: IConversationRepository,
    private _storageService: IStorageService,
    private _medicalRepRepository: IMedicalRepRepository,
    private _doctorRepository: IDoctorRepository
  ) {}
  async execute(userId?: string): Promise<ConversationDTO[]> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(
      userId
    );
    const { repId } = await this._medicalRepRepository.getRepIdByUserId(userId);

    let conversations = [];

    if (doctorId) {
      conversations = await this._conversationRepository.findUserConversations(
        doctorId
      );
    } else if (repId) {
      conversations = await this._conversationRepository.findUserConversations(
        repId
      );
    } else {
      throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    }
    return ConversationMapper.toDomainList(conversations, this._storageService);
  }
}
