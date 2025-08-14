export enum Role{
    SUPER_ADMIN = 'SUPER_ADMIN',
    DOCTOR = 'DOCTOR',
    MEDICAL_REP='MEDICAL_REP'
}


export enum AuthProvider {
    NATIVE = 'NATIVE',
    GOOGLE ='GOOGLE'
}



export interface UserLogin{
    id:string;
    email:string;
    passwordHash?:AuthProvider;
    providerId:string;
    createdAt:Date;
    updatedAt:Date;
}