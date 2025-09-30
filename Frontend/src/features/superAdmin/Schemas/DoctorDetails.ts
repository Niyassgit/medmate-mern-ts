export interface DoctorDetails{
    id:string,
    name:string ,
    email:string | null,
    isBlocked:boolean | null,
    phone:string,
    hasOwnClinic:boolean | null,
    hospital:string,
    registrationId:string,
    licenseImageUrl:string | null,
    opHours:string | null,
    about:string,
    educations:string[],
    certificates:string[],
    profileImage:string

    
}