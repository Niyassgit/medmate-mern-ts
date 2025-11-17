export interface IDoctorAcceptConnectionRequestUseCase{
    execute(repId:string,userId?:string):Promise<string>;
}