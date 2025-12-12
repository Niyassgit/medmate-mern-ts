import { IGuest } from "../entities/IGuest";

export interface IGuestRepository{
    createGuest(data:Omit<IGuest, "id" | "createdAt" | "updatedAt">):Promise<IGuest>;
    findGuestById(guestId:string):Promise<IGuest | null>;
    updateGuest(guestId:string,data:Omit<IGuest,"id" | "createdAt">):Promise<IGuest>;
    findByEmailId(email:string):Promise<IGuest | null>;
} 