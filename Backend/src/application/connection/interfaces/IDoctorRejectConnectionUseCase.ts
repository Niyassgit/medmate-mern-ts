export interface IDoctorRejectConnectionUseCase{
    execute(repId:string,notificationId:string,userId?:string):Promise<string>;
}