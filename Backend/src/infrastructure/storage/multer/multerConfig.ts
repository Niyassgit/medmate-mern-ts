import multer,{FileFilterCallback} from "multer";
import { Request } from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,path.join(__dirname,"../uploads/licenses"));
    },

    filename:(req,file,cb)=>{
        cb(null,Date.now() + "-"+file.originalname);
    },
});


const fileFilter=(
    req:Request,
    file:Express.Multer.File,
    cb:FileFilterCallback
)=>{
     if (["image/jpeg", "image/png", "application/pdf"].includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type!") as unknown as null, false);
  }

}

export const upload=multer({storage,fileFilter});