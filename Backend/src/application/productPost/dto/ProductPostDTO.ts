
export interface ProductPostDTO{
  id:string,
  repId:string,
  title:string,
  description:string,
  imageUrl:string[],
  brand: string,
  useCases:string[],
  ingredients:string[],
  termsOfUse:string,
  territoryId?: string; 
}


