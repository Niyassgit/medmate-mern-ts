import { OAuth2Client } from "google-auth-library";
import { IGoogleAuthService } from "../../domain/common/services/IGoogleAuthService";
import { env } from "../config/env";
import { BadRequestError, UnautharizedError } from "../../domain/common/errors";
import { ErrorMessages } from "../../shared/Messages";

const client = new OAuth2Client(env.googleClientId);
export class GoogleAuthService implements IGoogleAuthService {
  async verifyIdToken(
    idToken: string
  ): Promise<{ email: string; providerId: string }> {
    if (!idToken || idToken.trim().length === 0) {
      throw new BadRequestError(ErrorMessages.GOOGLE_TOKEN_REQUIRED);
    }

    try {
      const ticket = await client.verifyIdToken({
        idToken,
        audience: env.googleClientId,
      });

      const payload = ticket.getPayload();
      if (!payload || !payload.email || !payload.sub) {
        throw new BadRequestError(ErrorMessages.GOOGLE_TOKEN_PAYLOAD_INVALID);
      }

      return {
        email: payload.email,
        providerId: payload.sub,
      };
    } catch (error) {
      const err = error as Error;
      
      // If it's already an AppError, re-throw it
      if (error instanceof BadRequestError || error instanceof UnautharizedError) {
        throw error;
      }

      // Handle specific Google OAuth errors
      if (err.message.includes("Invalid token signature") || 
          err.message.includes("Token used too early") ||
          err.message.includes("expired")) {
        throw new UnautharizedError(ErrorMessages.GOOGLE_TOKEN_INVALID);
      }
      
      if (err.message.includes("audience")) {
        throw new BadRequestError(ErrorMessages.GOOGLE_TOKEN_AUDIENCE_MISMATCH);
      }
      
      // Generic Google auth failure
      throw new BadRequestError(ErrorMessages.GOOGLE_AUTH_FAILED);
    }
  }
}
