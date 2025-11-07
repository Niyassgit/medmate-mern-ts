import { MiniMedicalRepDetailsOnDoctor } from "./MiniMedicalRepDetailsOnDoctor";
import { PostDetailsDTO } from "./PostDetailsDTO";
import { RelatedProductDTO } from "./RelatedProductsDTO";


export interface PostDetailsResponseDTO{
  postDetails:PostDetailsDTO,
  repDetails:MiniMedicalRepDetailsOnDoctor,
  relatedProducts:RelatedProductDTO[] | null,
}