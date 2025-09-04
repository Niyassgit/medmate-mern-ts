import { IUserLoginRepository } from "../../../domain/common/repositories/IUserLoginRepository";

export class UnBlockUserUseCase{
    constructor(private _userLoginRepositories:IUserLoginRepository){}

    async execute(userId:string){
        return await this._userLoginRepositories.updateBlockStatus(userId,false);
    }
}