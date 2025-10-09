export interface IProfileImageUpdateUseCase{
    execute(userId:string,file:Express.Multer.File | null):Promise<string>;
}