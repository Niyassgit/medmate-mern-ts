import { JwtPayload } from "../../presentation/types/auth";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }

    namespace Multer {
      interface File {
        location?: string;
        key?: string;
      }
    }
  }
}
