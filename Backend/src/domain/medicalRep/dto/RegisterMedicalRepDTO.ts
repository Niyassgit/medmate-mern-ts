export interface RegisterMedicalRepDTO{

    name:string;
    email:string;
    phone:string;
    password?:string;
    companyName:string;
    companyLogoUrl?:string;
    employeeId:string;
    departmentId?:string;
}