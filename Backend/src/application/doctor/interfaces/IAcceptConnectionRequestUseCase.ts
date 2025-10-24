export interface IAcceptConnectionRequestUseCase{
    execute(repId:string,userId?:string):Promise<string>;
}