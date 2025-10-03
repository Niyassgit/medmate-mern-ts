import { AppError } from "./AppError";

export class UnautharizedError extends AppError {
  constructor(message = "Unautharized") {
    super(message, 401);
  }
}
