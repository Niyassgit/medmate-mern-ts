import { ISuperAdmin } from "../../../domain/superAdmin/entities/ISuperAdmin";
import { RegisterAdminDTO } from "../dto/RegisterAdminDTO";

export class SuperAdminMapper {
  static toSuperAdminEntity(
    dto: RegisterAdminDTO,
    loginId: string
  ): Omit<ISuperAdmin, "id"> {
    return {
      name: dto.name,
      phone: dto.phone,
      loginId,
    };
  }
}
