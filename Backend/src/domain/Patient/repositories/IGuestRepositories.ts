import { IGuest } from "../../Guest/entities/IGuest";
import { IGuestListItem } from "../entities/IGuestListItem";

export interface IGuestRepository{
    createGuest(data:Omit<IGuest, "id" | "createdAt" | "updatedAt">):Promise<IGuest>;
    findGuestById(guestId:string):Promise<IGuest | null>;
    updateGuest(guestId:string,data:Omit<IGuest,"id" | "createdAt">):Promise<IGuest>;
    findByEmailId(email:string):Promise<IGuest | null>;
    getAllGuests(
        page: number,
        limit: number,
        search: string,
        territory?: string
    ): Promise<{ guests: IGuestListItem[]; total: number }>;
    getGuestsByDoctorId(
        doctorId: string,
        search?: string
    ): Promise<IGuestListItem[]>;
}

