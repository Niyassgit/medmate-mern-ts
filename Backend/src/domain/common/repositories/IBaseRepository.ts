export interface IBaseRepository<T>{
    findById(id:string):Promise<T | null>;
    findAll():Promise<T[]>;
    create(data:Omit<T,"id" | "createdAt" | "updatedAt">):Promise<T>;
    update(id:string,data:Partial<T>):Promise<T | null>;
    delete(id:string):Promise<boolean>;
}