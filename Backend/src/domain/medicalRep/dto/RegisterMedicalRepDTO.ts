export interface RegisterMedicalRepDTO{

    name:string;
    email:string;
    phone:string;
    password?:string;
    companyName:string;
    companyLogoUrl?:File;
    employeeId:string;
    departmentId?:string;
}