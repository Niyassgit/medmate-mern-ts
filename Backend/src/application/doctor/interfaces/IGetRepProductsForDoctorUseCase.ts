import { ProductDTO } from "../../product/dto/ProdductDTO";

export interface IGetRepProductsForDoctorUseCase {
  execute(repId: string, doctorUserId?: string): Promise<ProductDTO[]>;
}

