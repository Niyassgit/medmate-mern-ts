import {z} from "zod";
import { Request,Response,NextFunction } from "express";


export const RegisterDoctorSchema=z.object({
     
      name:z.string().min(1,"Name is required"),
      email:z.string().email("Invalid email"),
      phone:z.string().regex(/^\+?\d{10,15}$/,"Invalid phone number").optional(),
      password:z.string().min(6,"Password must be atleast 6 characters").optional(),
      hospitalId:z.string().min(1,"Invalid hospital id"),
      registrationId:z.string().min(1,"Please insert valid registeration id"),
      opHours:z.string().min(3,"Please insert valid op hour").optional(),
      licenseImageUrl:z.string().url("Invalid license image"),
      hasOwnClinic:z.boolean().default(false)
});

export const validateRegisterDoctorSchema=(req:Request,res:Response,next:NextFunction)=>{
        
    const result = RegisterDoctorSchema.safeParse(req.body);

  if (!result.success) {
    console.log("Validation errors:", result.error.issues);
    return res.status(400).json({ message: "Validation failed", errors: result.error.issues });
  }

  next();

 
};
