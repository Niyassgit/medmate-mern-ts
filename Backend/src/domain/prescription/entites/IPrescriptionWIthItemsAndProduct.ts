import { IOrderMinimal } from "../../order/entitiy/IOrderMinimal";
import { IProduct } from "../../product/entities/IProduct";
import { IPrescription } from "./IPrescription";
import { IPrescriptionItem } from "./IPrescriptionItem";

export type IPrescriptionWithItemsAndProduct = IPrescription & {
  items: (IPrescriptionItem & { product: IProduct })[];
  order?: IOrderMinimal | null;
  doctor: {
    name: string;
    hospital: string;
  };
  guest: {
    name: string;
    email?: string | null;
    phone?: string | null;
  };
};
