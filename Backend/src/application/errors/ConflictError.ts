import { AppError } from "./AppError";
import { HttpStatusCode } from "../../shared/HttpStatusCodes";

export class ConflictError extends AppError {
  constructor(message = "Conflict") {
    super(message, HttpStatusCode.CONFLICT);
  }
}
