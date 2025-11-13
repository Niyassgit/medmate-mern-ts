export interface IDeletePostUseCase{
    execute(postId:string,userId?:string):Promise<string>;
}