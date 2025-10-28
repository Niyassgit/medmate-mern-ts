import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {v2 as cloudinary} from "cloudinary";
import {env} from "../../config/env"

cloudinary.config({
    cloud_name:env.cloudinary.name,
    api_key:env.cloudinary.apiKey,
    api_secret:env.cloudinary.apiSecret,
});


const storage=new CloudinaryStorage({
    cloudinary,
    params:(req,file)=>{
        let folder="others";

        if(file.fieldname === "profileImage"){
            folder="profiles";
        }else if (file.fieldname === "images") { 
        folder = "products";
    }

    return {
        folder,
        allowed_formats:["jpg","jpeg","webp","pdf","png"],
        public_id:Date.now()+ "-"+ file.originalname.split(".")[0]
    }
    },
});

export const    uploadCloud=multer({storage});