import {
  BadRequestError,
  NotFoundError,
  UnautharizedError,
} from "../../../domain/common/errors";
import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IProductRepositories } from "../../../domain/product/repositories/IProductRepository";
import { ITerritoryRepository } from "../../../domain/territory/ITerritoryRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { Role, ConnectionStatus } from "../../../shared/Enums";
import { IGetRepProductsForDoctorUseCase } from "../interfaces/IGetRepProductsForDoctorUseCase";
import { ProductDTO } from "../../product/dto/ProdductDTO";
import { ProductMapper } from "../../product/mappers/ProductMapper";
import { IUserRepository } from "../../../domain/common/repositories/IUserRepository";

export class GetRepProductsForDoctorUseCase
  implements IGetRepProductsForDoctorUseCase
{
  constructor(
    private _userRepository: IUserRepository,
    private _doctorRepository: IDoctorRepository,
    private _connectionRepository: IConnectionRepository,
    private _productRepository: IProductRepositories,
    private _storageService: IStorageService,
    private _territoryRepository: ITerritoryRepository
  ) {}

  async execute(repId: string, doctorUserId: string): Promise<ProductDTO[]> {
    const user = await this._userRepository.findById(doctorUserId);
    if (!user) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    if (user.role !== Role.DOCTOR)
      throw new UnautharizedError(ErrorMessages.DOCTOR_ACCESS);

    const doctor = await this._doctorRepository.getDoctorByUserId(doctorUserId);
    if (!doctor) throw new NotFoundError(ErrorMessages.USER_NOT_FOUND);
    const connection =
      await this._connectionRepository.findConnectionBetweenDoctorAndRep(
        doctor.id,
        repId
      );

    if (!connection || connection.status !== ConnectionStatus.ACCEPTED) {
      throw new BadRequestError(ErrorMessages.NOT_CONNECTED);
    }

    const products = await this._productRepository.getAllProductsByRepId(repId);
    return Promise.all(
      products.map((product) =>
        ProductMapper.toDomain(
          product,
          this._storageService,
          this._territoryRepository
        )
      )
    );
  }
}
