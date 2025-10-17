import { HttpStatusCode } from "../../shared/HttpStatusCodes";
import { AppError } from "./AppError";

export class UnautharizedError extends AppError {
  constructor(message = "Unautharized") {
    super(message, HttpStatusCode.UNAUTHORIZED);
  }
}
