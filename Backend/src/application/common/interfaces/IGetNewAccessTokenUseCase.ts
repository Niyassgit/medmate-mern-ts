
export interface IGetNewAccessTokenUseCase{
execute(refreshToken:string):Promise<string>;
}