export interface IStorageService {
  generateSignedUrl(key: string): Promise<string>;
}
