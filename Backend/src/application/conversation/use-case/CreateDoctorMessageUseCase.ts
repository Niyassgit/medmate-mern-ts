import { IMessageRepository } from "../../../domain/chat/respositories/IMessageRepository";
import { BadRequestError } from "../../../domain/common/errors";
import { IChatEventPublisher } from "../../../domain/common/services/IChatEventPublisher";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { UnautharizedError } from "../../errors";
import { CreateMessageDTO } from "../dto/CreateMessageDTO";
import { MessageResponseDTO } from "../dto/MessageResponseDTO";
import { ICreateDoctorMessageUseCase } from "../interfaces/ICreateDoctorMessageUseCase";
import { MessageMapper } from "../mappers/MessageMapper";

export class CreateDoctorMessageUseCase implements ICreateDoctorMessageUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _messageRepository: IMessageRepository,
    private _chatEventPublisher: IChatEventPublisher
  ) {}

  async execute(
    data: CreateMessageDTO,
    userId?: string
  ): Promise<MessageResponseDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);

    const { doctorId } = await this._doctorRepository.getDoctorIdByUserId(userId);
    if (!doctorId) throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);

    const mappedMessage = MessageMapper.toEntity(data, doctorId);
    const savedMessage = await this._messageRepository.createMessage(mappedMessage);
    const response = MessageMapper.toDomain(savedMessage);

    await this._chatEventPublisher.publishNewMessage(
      data.conversationId,
      response
    );

    return response;
  }
}