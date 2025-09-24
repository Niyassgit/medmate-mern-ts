import {z} from "zod";

export const ResetPasswordSchema =z.object({
    password:z.string().min(6,"Password atleast containing 6 characters"),
    Cpassword:z.string().min(6,"confirm your password"),
}).refine((data)=>data.password ===data.Cpassword,{
    message:"Password do not match",
    path:["Cpassword"]
});

export type ResetPasswordBody = z.infer<typeof ResetPasswordSchema>;