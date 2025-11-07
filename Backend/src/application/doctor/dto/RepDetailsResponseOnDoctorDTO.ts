import { MedicalRepDetailsOnDoctorDTO } from "./MedicalRepDetailsDTO";
import { RelatedProductDTO } from "./RelatedProductDTO";

export interface RepDetailsResponseOnDoctorDTO{
    medicalRep:MedicalRepDetailsOnDoctorDTO;
    posts:RelatedProductDTO[] | null;

}