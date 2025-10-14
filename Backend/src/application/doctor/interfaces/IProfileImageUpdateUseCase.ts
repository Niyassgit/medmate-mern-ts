export interface IProfileImageUpdateUseCase{
    execute(userId:string,file?:string | null):Promise<string>;
}