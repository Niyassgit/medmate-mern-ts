import { OrderDetailsResponseDTO } from "../dto/OrderDetailsResponseDTO";

export interface IGetOrderDetailsUseCase {
    execute(orderId: string): Promise<OrderDetailsResponseDTO | null>;
}
