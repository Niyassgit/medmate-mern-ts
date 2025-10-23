export interface DoctorNetworkCardDTO{
    id:string;
    name:string;
    department:string | null,
    hospitalName:string,
    profileImage?:string | null,
}