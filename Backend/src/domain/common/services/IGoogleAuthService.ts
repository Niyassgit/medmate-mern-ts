import { GoogleTokenPayload } from "../types/GoogleTokenPayload";

export interface IGoogleAuthService {
  verifyIdToken(
    idToken: string
  ): Promise<GoogleTokenPayload>;
}
