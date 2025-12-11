import { ITokenService } from "../../domain/common/services/ITokenSerivce";
import crypto from "crypto";

export class TokenService implements ITokenService {
  async generateShareToken(length: number): Promise<string> {
    return crypto.randomBytes(length).toString("hex");
  }

  async generateUrlSafeToken(): Promise<string> {
    return crypto.randomBytes(24).toString("base64url");
  }
}
