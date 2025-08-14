import {z} from "zod";
import {Request,Response,NextFunction} from "express"

const registerMedicalRepSchema=z.object({
   name:z.string().min(1,"name is required"),
   email:z.string().email("Invalid email address"),
   phone:z.string().regex(/^\+?\d{10,15}$/,"Invalid phone number").optional(),
   password:z.string().min(6,"Password must be atleast 6 characters").optional(),
   companyName:z.string().min(1),
   companyLogoUrl:z.string().url().optional(),
   departmentId: z.string().optional(),
})

export const  ValidateMedicalRepRegisterSchema=(req:Request,res:Response,next:NextFunction)=>{
   
      const result=  registerMedicalRepSchema.safeParse(req.body);
      if(!result.success){
     return res.status(400).json({ message: "Validation failed", errors: result.error.issues });
      }
     
      next();
}