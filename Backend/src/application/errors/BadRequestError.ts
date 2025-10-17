import { HttpStatusCode } from "../../shared/HttpStatusCodes";
import { AppError } from "./AppError";

export class BadRequestError extends AppError {
  constructor(message = "Bad Request") {
    super(message, HttpStatusCode.BAD_REQUEST);
  }
}
