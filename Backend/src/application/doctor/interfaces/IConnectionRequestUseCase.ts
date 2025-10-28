export interface IConnectionRequestUseCase{
    execute(repId:string,userId?:string):Promise<string>;
}