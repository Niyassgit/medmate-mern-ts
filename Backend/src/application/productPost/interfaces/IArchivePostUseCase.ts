export interface IArchivePostUseCase{
    execute(postId:string,userId?:string):Promise<string>;
}