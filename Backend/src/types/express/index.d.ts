import { JwtPayload } from "../../presentation/types/auth";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}
