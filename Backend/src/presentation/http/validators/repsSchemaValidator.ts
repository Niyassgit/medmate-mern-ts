import {z} from "zod";
import {Request,Response,NextFunction} from "express"

const registerMedicalRepSchema=z.object({
   name:z.string().min(1,"name is required"),
   email:z.string().email("Invalid email address"),
   phone:z.string().regex(/^\+?\d{10,15}$/,"Invalid phone number"),
   password:z.string().min(6,"Password must be atleast 6 characters"),
   companyName:z.string().min(1),
   companyLogoUrl:z.string().url().optional(),
})

export const  validateMedicalRepRegisterSchema=(req:Request,res:Response,next:NextFunction)=>{
   
      try {
         registerMedicalRepSchema.parse(req.body);
         next();
      } catch (error:any) {
        console.error("zod validate Error",error.errors);
        res.status(404).json({message:"Validation failed",errors:error.errors})
      }
     
}