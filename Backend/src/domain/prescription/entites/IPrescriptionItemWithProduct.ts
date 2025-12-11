import { IProduct } from "../../product/entities/IProduct";

export interface IPrescriptionItemWithProduct {
  id: string;
  prescriptionId: string;
  productId: string;
  dosage?: string;
  quantity: number;

  product: IProduct;
}
