import {z} from "zod";

export const validateLogin=z.object({
    email:z.string().email("Invalid email address"),
    password:z.string().min(6,"Invalid password"),

});

export type LoginRequestBody=z.infer<typeof validateLogin>;

