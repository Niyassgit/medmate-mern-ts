import { IStorageService } from "../../../domain/common/services/IStorageService";
import { IConnectionRepository } from "../../../domain/connection/repositories/IConnectionRepository";
import { IDoctorRepository } from "../../../domain/doctor/repositories/IDoctorRepository";
import { IProductPostRepository } from "../../../domain/productPost/repositories/IProductPostRepository";
import { ErrorMessages } from "../../../shared/Messages";
import { ProductPostListStatus } from "../../../shared/Enums";
import {
  BadRequestError,
  UnautharizedError,
} from "../../errors";
import { MedicalRepMapper } from "../../medicalRep/mapper/MedicalRepMapper";
import { ProductPostMapper } from "../../productPost/mappers/ProductPostMapper";
import { PostDetailsResponseDTO } from "../dto/PostDetailsResponseDTO";
import { IPostDetailsUseCase } from "../interfaces/IPostDetailsUseCase";

export class PostDetailsUseCase implements IPostDetailsUseCase {
  constructor(
    private _doctorRepository: IDoctorRepository,
    private _postRepository: IProductPostRepository,
    private _connectionRepository: IConnectionRepository,
    private _storageService: IStorageService
  ) {}
  async execute(
    postId: string,
    userId?: string
  ): Promise<PostDetailsResponseDTO> {
    if (!userId) throw new UnautharizedError(ErrorMessages.UNAUTHORIZED);
    const doctor = await this._doctorRepository.getDoctorByUserId(userId);
    if (!doctor)
      throw new BadRequestError(ErrorMessages.COMPLETE_PROFILE_ERROR);
    const postDetails = await this._postRepository.findPostById(postId);
    if (!postDetails) throw new BadRequestError(ErrorMessages.POST_NOT_FOUND);
    const medicalRep = await this._postRepository.findRepByPostId(postId);
    if (!medicalRep) throw new BadRequestError(ErrorMessages.RETRY_LATER);

    const repIsConnected = await this._connectionRepository.findByDoctorAndRep(
      doctor?.id,
      medicalRep?.id
    );
    const mappedPost = await ProductPostMapper.toDomain(postDetails,this._storageService);
    const mappedRep = await MedicalRepMapper.toDoctorDomian(
      medicalRep,
      !!repIsConnected,
      this._storageService
    );
    const allProducts = await this._postRepository.getProducts(medicalRep.id, ProductPostListStatus.PUBLISHED);
    const relatedProducts = (allProducts ?? []).filter(
      (product) => product.id !== postDetails.id
    );
    const mappedRelatedProducts =
      await ProductPostMapper.toRelatedProductsDomain(
        relatedProducts,
        this._storageService
      );
    return {
      postDetails: mappedPost,
      repDetails: mappedRep,
      relatedProducts: mappedRelatedProducts,
    };
  }
}
