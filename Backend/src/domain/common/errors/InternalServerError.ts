import { AppError } from "./AppError";

export class InternalServerError extends AppError{

    constructor(message="Internal Server Error"){
        super(message,500);
    }
} 