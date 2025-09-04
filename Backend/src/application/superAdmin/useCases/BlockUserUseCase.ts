import { IUserLoginRepository } from "../../../domain/common/repositories/IUserLoginRepository";


export class BlockUserUseCase{

    constructor(private _userLoginRepository:IUserLoginRepository){}

    async execute(userId:string){
        return await this._userLoginRepository.updateBlockStatus(userId,true);
    }
}