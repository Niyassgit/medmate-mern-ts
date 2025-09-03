export interface IMedicalRep{
    id:string;
    loginId:string | null;
    createdAt:Date;
    updatedAt:Date;


    name:string;
    phone:string;
    companyName:string;
    companyLogoUrl?:string| null;
    employeeId?:string | null;
    departmentId?:string| null;
    about?:string | null;


    subscriptionPlanId?:string | null;
    subscriptionStatus?:boolean| null;
    subscriptionStart?:Date | null;
    subscriptionEnd?:Date | null;
    maxConnectionsPerDay?:number | null;
}