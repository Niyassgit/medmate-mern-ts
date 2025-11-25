import { IMessageRepository } from "../../../domain/chat/respositories/IMessageRepository";
import { BadRequestError } from "../../../domain/common/errors";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { UnautharizedError } from "../../errors";
import { CreateMessageDTO } from "../dto/CreateMessageDTO";
import { MessageResponseDTO } from "../dto/MessageResponseDTO";
import { ICreateMessageUseCase } from "../interfaces/ICreateMessageUseCase";
import { MessageMapper } from "../mappers/MessageMapper";

export class CreateMessageUseCase implements ICreateMessageUseCase {
  constructor(
    private _messageRepository: IMessageRepository,
    private _doctorRepository: IDoctorRepository,
    private _medicalRepRepository: IMedicalRepRepository
  ) {}
  async execute(
    data: CreateMessageDTO,
    userId?: string
  ): Promise<MessageResponseDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const doctor = await this._doctorRepository.getDoctorIdByUserId(userId);
    const rep = await this._medicalRepRepository.getRepIdByUserId(userId);

    let profileId: string;

    if (doctor && doctor.doctorId) {
      profileId = doctor.doctorId;
    } else if (rep && rep.repId) {
      profileId = rep.repId;
    } else {
      throw new BadRequestError(ErrorMessages.USER_NOT_FOUND);
    }

    const mappedMessage = MessageMapper.toEntity(data, profileId);
    return await this._messageRepository.createMessage(mappedMessage);
  }
}
