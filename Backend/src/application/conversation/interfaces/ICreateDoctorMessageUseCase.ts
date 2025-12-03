import { CreateMessageDTO } from "../dto/CreateMessageDTO";
import { MessageResponseDTO } from "../dto/MessageDTO";

export interface ICreateDoctorMessageUseCase{
    execute(data:CreateMessageDTO,userId?:string):Promise<MessageResponseDTO>;
}