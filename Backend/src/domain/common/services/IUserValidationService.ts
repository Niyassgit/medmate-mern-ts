export interface IUserValidationService{
    validateUser(userId?:string):Promise<void>
}