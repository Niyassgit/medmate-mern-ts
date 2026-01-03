import { ITokenService } from "../../domain/common/services/ITokenSerivce";
import crypto from "crypto";

export class TokenService implements ITokenService {
  generateShareToken(length: number): Promise<string> {
    return Promise.resolve(crypto.randomBytes(length).toString("hex"));
  }

  generateUrlSafeToken(): Promise<string> {
    return Promise.resolve(crypto.randomBytes(24).toString("base64url"));
  }
}
