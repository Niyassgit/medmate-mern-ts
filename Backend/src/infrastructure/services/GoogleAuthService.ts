import { OAuth2Client} from "google-auth-library";
import { IGoogleAuthService } from "../../domain/common/services/IGoogleAuthService";

const client=new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
export class GoogleAuthService implements IGoogleAuthService {

    async verifyIdToken(idToken: string): Promise<{ email: string; providerId: string; }> {
        
  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.email || !payload.sub) {
      throw new Error("Invalid Google token payload");
    }

    return {
      email: payload.email,
      providerId: payload.sub,
    };
  } catch (err) {
    throw err;
  }
    }



}