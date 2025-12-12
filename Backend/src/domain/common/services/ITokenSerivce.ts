export interface ITokenService {
  generateShareToken(length: number): Promise<string>;
  generateUrlSafeToken(): Promise<string>;
}
