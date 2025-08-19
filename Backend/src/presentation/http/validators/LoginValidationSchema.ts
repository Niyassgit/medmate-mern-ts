import {z} from "zod";
import { Request,Response,NextFunction } from "express";

const validateLogin=z.object({
    email:z.string().email("Invalid email address"),
    password:z.string().min(6,"Invalid password"),

});


export const validateLoginSchema=async(req:Request,res:Response,next:NextFunction)=>{
    

    const result=validateLogin.safeParse(req.body);
    if(!result.success){
        return res.status(400).json({message:"Validation failed",errors:result.error.issues});
    }
    next();
}