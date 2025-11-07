import { PostDetailsDTO } from "../../productPost/dto/PostDetailsDTO";
import { MiniMedicalRepDetailsOnDoctor } from "./MiniMedicalRepDetailsOnDoctor";
import { RelatedProductDTO } from "./RelatedProductDTO";

export interface PostDetailsResponseDTO{
  postDetails:PostDetailsDTO,
  repDetails:MiniMedicalRepDetailsOnDoctor,
  relatedProducts:RelatedProductDTO[] | null,
}