import {z} from "zod";
import { Request,Response,NextFunction } from "express";


const superAdminRegisterSchema=z.object({
    name:z.string().min(1,"Name is Required"),
    email:z.string().email("Invalid Email"),
    password:z.string().min(6,"password must be atleast 6 characters").optional(),
    phone:z.string().regex(/^\+?\d{10,15}$/,"Invalid phone number").optional()
});


export const validateSuperAdminSchema=(req:Request,res:Response,next:NextFunction)=>{

    const result=superAdminRegisterSchema.safeParse(req.body);
    if(!result.success){
       return res.status(400).json({message:"Validation failed",errors:result.error.issues});
    }
    next();
}
    