export interface IAcceptConnectionRequestUseCase{
    execute(doctorId:string,userId?:string):Promise<string>;
}