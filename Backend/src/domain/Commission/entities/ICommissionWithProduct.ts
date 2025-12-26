import { ICommission } from "./ICommission";
import { IProduct } from "../../product/entities/IProduct";

export interface ICommissionWithProduct extends ICommission {
  product: IProduct | null;
}

