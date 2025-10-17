import { HttpStatusCode } from "../../shared/HttpStatusCodes";
import { AppError } from "./AppError";

export class ForbiddenError extends AppError {
  constructor(message = "Access Denied") {
    super(message, HttpStatusCode.FORBIDDEN);
  }
}
