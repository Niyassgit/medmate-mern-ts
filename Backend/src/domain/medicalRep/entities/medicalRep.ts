export interface MedicalRep{
    id:string;
    loginId:string | null;
    createdAt:Date;
    updatedAt:Date;


    name:string;
    phone:string;
    companyName:string;
    companyLogoUrl?:File| null;
    employeeId?:string | null;
    departmentId?:string| null;
    about?:string | null;


    subscriptionPlanId?:string | null;
    subscriptionStatus?:string | null;
    subscriptionStart?:Date | null;
    subscriptionEnd?:Date | null;
    maxConnectionsPerDay?:number | null;
}