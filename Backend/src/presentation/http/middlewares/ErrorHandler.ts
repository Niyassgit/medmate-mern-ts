import { Request,Response} from "express"
import { AppError } from "../../../domain/common/errors";


export const ErrorHandler=(err:unknown,req:Request,res:Response)=>{
    if(err instanceof AppError){
        res.status(err.statusCode).json({success:false,message:err.message});
    }else{
        console.log(err);
        res.status(500).json({success:false,message:"Internal Server Error"});
    }
}