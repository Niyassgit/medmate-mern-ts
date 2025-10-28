export interface IMakeConnectionRequestUseCase{
    execute(doctorId:string,userId?:string):Promise<string>;
}