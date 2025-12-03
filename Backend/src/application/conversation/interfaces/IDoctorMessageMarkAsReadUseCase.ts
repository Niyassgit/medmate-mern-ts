export interface IDoctorMessageMarkAsReadUseCase{
    execute(conversationId:string,userId?:string):Promise<void>;
}