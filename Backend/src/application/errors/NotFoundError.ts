import { HttpStatusCode } from "../../shared/HttpStatusCodes";
import { AppError } from "./AppError";

export class NotFoundError extends AppError {
  constructor(message = "Resource Not Found") {
    super(message, HttpStatusCode.NOT_FOUND);
  }
}
