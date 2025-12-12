export interface PrescriptionProductDTO {
  id: string;
  productId: string;
  mrp:number;
  productName: string;
  brand: string;
  image: string | null;
  quantity: number;
  dosage?: string;
  note?: string;

}