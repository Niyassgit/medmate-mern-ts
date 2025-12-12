import { IPrescriptionWithItemsAndProduct } from "../../../domain/prescription/entites/IPrescriptionWIthItemsAndProduct";
import { IPaymentItem } from "../dto/IPaymentItem";


export class OrderUtils {
    static calculateOrderDetails(prescription: IPrescriptionWithItemsAndProduct): { totalAmount: number; paymentItems: IPaymentItem[] } {
        let totalAmount = 0;
        const paymentItems: IPaymentItem[] = [];

        if (prescription.items) {
            for (const item of prescription.items) {
                const product = item.product;

                if (!product) continue;

                const price = product.mrp || 0;
                const name = product.name || "Product";
                const image = product.imageUrl && product.imageUrl.length > 0 ? product.imageUrl[0] : "";

                totalAmount += price * item.quantity;

                paymentItems.push({
                    name,
                    price,
                    quantity: item.quantity,
                    image
                });
            }
        }

        return { totalAmount, paymentItems };
    }
}
