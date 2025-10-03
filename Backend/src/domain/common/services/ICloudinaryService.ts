export interface ICloudinaryService {
    uploadProfileImage(userId:string,file:Express.Multer.File):Promise<string>;
}