export interface IProfileImageUpdateUseCase{
    execute(userId:string,fileUrl?:string|null):Promise<string>;
}