import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import {v2 as cloudinary} from "cloudinary";

cloudinary.config({
    cloud_name:process.env.CLOUDINARY_CLOUD_NAME,
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
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