import jwt from "jsonwebtoken";
import { IJWtService } from "../../domain/common/services/IJWTService";
import {
  JwtPayload,
  RefreshTokenPayload,
} from "../../domain/common/types/JwtPayload";

export class JWTServices implements IJWtService {
  private accessSecret = process.env.ACCESS_TOKEN!;
  private refreshSecret = process.env.REFRESH_TOKEN!;

  signAccessToken(payload: JwtPayload): string {
    return jwt.sign(payload, this.accessSecret, { expiresIn: "15m" });
  }
  signRefreshToken(payload: RefreshTokenPayload): string {
    return jwt.sign(payload, this.refreshSecret, { expiresIn: "7d" });
  }
  verifyAccessToken(token: string): JwtPayload | null {
    try {
      return jwt.verify(token, this.accessSecret) as JwtPayload;
    } catch (error) {
      return null;
    }
  }

  verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
      return jwt.verify(token, this.refreshSecret) as RefreshTokenPayload;
    } catch {
      return null;
    }
  }
}
