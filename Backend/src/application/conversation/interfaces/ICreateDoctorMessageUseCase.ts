import { CreateMessageDTO } from "../dto/CreateMessageDTO";
import { MessageDTO } from "../dto/MessageDTO";

export interface ICreateDoctorMessageUseCase{
    execute(data:CreateMessageDTO,userId?:string):Promise<MessageDTO>;
}