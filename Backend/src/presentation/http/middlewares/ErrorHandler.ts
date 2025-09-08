import { Request,Response,NextFunction} from "express"
import { AppError } from "../../../domain/common/errors";


export const ErrorHandler=(err:unknown,req:Request,res:Response,next:NextFunction)=>{
    if(err instanceof AppError){
        res.status(err.statusCode).json({success:false,message:err.message});
    }else{
        console.error("🔥 Unhandled Error:", err); 
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}