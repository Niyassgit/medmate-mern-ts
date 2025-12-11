import { IProduct } from "../../product/entities/IProduct";
import { IPrescription } from "./IPrescription";
import { IPrescriptionItem } from "./IPrescriptionItem";

export type IPrescriptionWithItemsAndProduct =
  IPrescription & {
    items: (IPrescriptionItem & { product: IProduct })[];
  };