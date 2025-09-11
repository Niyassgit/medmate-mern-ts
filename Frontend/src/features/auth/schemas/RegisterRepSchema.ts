import {z} from "zod";

export const registerMedicalRepSchema=z.object({
   name:z.string().min(1,"name is required"),
   email:z.string().email("Invalid email address"),
   phone:z.string().regex(/^\+?\d{10,15}$/,"Invalid phone number").optional(),
   password:z.string().min(6,"Password must be atleast 6 characters").optional(),
   Cpassword:z.string().min(6,"Confirm your password").optional(),
   companyName:z.string().min(1),
   companyLogoUrl:z.any(),
   employeeId:z.string().min(1,"Employee Id required"),
//    territoryId:z.string().min(1,"Territory required")
//    departmentId: z.string().optional(),
}).refine((data)=>data.password ===data.Cpassword,{
    message:"Password do not match",
    path:["Cpassword"]
});

export type RegisterRepBody=z.infer<typeof registerMedicalRepSchema>;