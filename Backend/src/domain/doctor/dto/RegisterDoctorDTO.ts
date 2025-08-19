export interface RegisterDoctorDTO{
    name:string;
    email:string;
    password?:string;
    phone:string;
    departmentId?:string | null;
    territoryId?: string | null;
    hospitalId:string;
    registrationId:string;
    licenseImageUrl: File;
    opHours:string;
    hasOwnClinic?:boolean |null;  
}