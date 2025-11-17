export interface IDoctorConnectionRequestUseCase{
    execute(repId:string,userId?:string):Promise<string>;
}