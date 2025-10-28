export interface IProfileImageUpdateUseCase{
    execute(userId:string,fileKey?:string | null):Promise<{message:string,signedUrl:string}>;
}