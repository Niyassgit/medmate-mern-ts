
import { IGuest } from "../../../domain/Guest/entities/IGuest";
import { IUser } from "../../../domain/common/entities/IUser";
import { ProfileDTO } from "../dto/ProfileDTO";

export class GuestProfileMapper {
    static toProfileDTO(
        guest: IGuest,
        territoryName: string
    ): ProfileDTO {
        return {
            id: guest.id,
            name: guest.name,
            email: guest.email ?? "",
            phone: guest.phone ?? "",
            territoryName,
            isRegistered: guest.isRegistered,
            profileImage: "",
        };
    }

    static toProfileDTOFromUser(
        user: IUser,
        profileImage: string
    ): ProfileDTO {
        return {
            id: user.id,
            name: "", 
            email: user.email,
            phone: "", 
            territoryName: "Unknown",
            isRegistered: false,
            profileImage,
        };
    }
}
