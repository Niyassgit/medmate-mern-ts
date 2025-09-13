import bcrypt from "bcryptjs";


export class BcryptServices{

    private readonly saltRounds=10;

    async hashValue(value:string):Promise<string>{
        return bcrypt.hash(value,this.saltRounds);
    }

    async compareValue(value:string,hashedValue:string):Promise<boolean>{
        return bcrypt.compare(value,hashedValue);
    }
}