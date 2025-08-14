import bcrypt from "bcryptjs";


export class BcryptServices{

    private readonly saltRounds=10;

    async hashPassword(password:string):Promise<string>{
        return bcrypt.hash(password,this.saltRounds);
    }

    async comparePassword(password:string,hashedPassword:string):Promise<Boolean>{
        return bcrypt.compare(password,hashedPassword);
    }
}