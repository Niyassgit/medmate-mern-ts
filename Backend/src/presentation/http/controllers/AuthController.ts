import { Request,Response } from "express";
import { LoginUserUseCase } from "../../../application/common/LoginUserUseCase";
import { LoginRequestBody } from "../validators/LoginValidationSchema";

export class AuthController{

    constructor(
        private _userLoginUseCase:LoginUserUseCase
    ){}



    loginUser=async(req:Request,res:Response)=>{
        const {email,password}=req.body as LoginRequestBody;
        const result=await this._userLoginUseCase.execute(email,password);

        
            res.cookie("refreshtoken",result.refreshToken,{
                httpOnly:true,
                sameSite:"strict",
                secure:process.env.NODE_ENV==='production',
                maxAge:7*24*60*60*1000
            });

             res.json({
                accessToken:result.accessToken,
                user:{
                    id:result.user.id,
                    email:result.user.email,
                    role:result.user.role
                }
            })

    }

}


