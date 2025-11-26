import { CreateMessageDTO } from "../dto/CreateMessageDTO";
import { MessageResponseDTO } from "../dto/MessageResponseDTO";

export interface ICreateDoctorMessageUseCase{
    execute(data:CreateMessageDTO,userId?:string):Promise<MessageResponseDTO>;
}