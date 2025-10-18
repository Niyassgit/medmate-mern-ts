export interface IStorageService {
  generateSignedUrl(key: string): Promise<string>;
  deleteFile(fileKey:string):Promise<void>;
}
