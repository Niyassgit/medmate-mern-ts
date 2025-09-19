import { IMedicalRepRepository } from "../../../domain/medicalRep/repositories/IMedicalRepRepository";
import { IMedicalRep } from "../../../domain/medicalRep/entities/IMedicalRep";
import { UnautharizedError } from "../../../domain/common/errors";

export class GetMedicalRepByEmailUseCase {
  constructor(private _medicalRepRepository: IMedicalRepRepository) {}

  async execute(email: string): Promise<IMedicalRep> {
    const rep = await this._medicalRepRepository.getMedicalRepByEmail(email);

    if (!rep) {
      throw new UnautharizedError(`Medical rep with email ${email} not found`);
    }
    return rep;
  }
}
