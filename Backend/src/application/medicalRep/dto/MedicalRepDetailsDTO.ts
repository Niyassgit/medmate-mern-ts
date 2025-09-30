export interface MedicalRepDetailsDTO{
    id:string,
    email:string | null,
    isBlocked:boolean | null,
    name:string,
    phone:string,
    companyName:string,
    companyLogoUrl:string | null,
    employeeId:string | null,
    subscriptionStatus:boolean | null,
    maxConnectionsPerDay:number | null,
    profileImage:string | null

}