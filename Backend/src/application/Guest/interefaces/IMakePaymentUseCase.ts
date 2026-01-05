import { MakePaymentDTO } from "../dto/MakePaymentDTO";

export interface IMakePaymentUseCase {
    execute(data:MakePaymentDTO): Promise<string | null>;
}