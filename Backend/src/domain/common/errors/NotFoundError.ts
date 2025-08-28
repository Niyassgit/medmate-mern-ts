import { AppError } from "./AppError";


export class NotFoundError extends AppError{
    constructor(message="Resource Not Found"){
        super(message,404);
    }
}