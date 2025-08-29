import {z} from "zod";



export const SuperAdminRegisterSchema=z.object({
    name:z.string().min(1,"Name is Required"),
    email:z.string().email("Invalid Email"),
    password:z.string().min(6,"password must be atleast 6 characters").optional(),
    phone:z.string().regex(/^\+?\d{10,15}$/,"Invalid phone number").optional()
});



