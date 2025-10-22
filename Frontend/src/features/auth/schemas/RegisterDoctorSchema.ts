import { z } from "zod";



export const RegisterDoctorSchema = z.object({

  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().regex(/^\+?\d{10,15}$/, "Invalid phone number"),
  password: z.string().min(6, "Password must be atleast 6 characters"),
  Cpassword: z.string().min(6, "Confirm your password"),
  departmentId: z.string().min(1, "Department is required"),
  territoryId: z.string().min(1, "Territory is required"),
  hospital: z.string().min(1, "Invalid hospital id"),
  registrationId: z.string().min(1, "Please insert valid registeration id"),
  opHours: z.string().min(3, "Please insert valid op hour"),
  licenseImageUrl: z.any().optional(),
 hasOwnClinic: z.boolean().default(false).optional(),
}).refine((data)=>data.password===data.Cpassword,{
    message:"Passwords do not match",
    path:["Cpassword"],
});


export type RegisterDoctorBody=z.infer<typeof RegisterDoctorSchema>;