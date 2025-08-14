export interface RegisterDoctorDTO{
    name:string;
    email:string;
    phone:string;
    password:string;
    department?:string | null;
    territoryId?: string | null;
    hospitalId:string;
    registrationId:string;
    licenseImageUrl: string;
    opHours:string;
    hasOwnClinic:boolean |null;  
}