import multer from "multer";
import multerS3 from "multer-s3";
import { env } from "../../../config/env";
import { s3 } from "../../../config/S3Client";



const storage = multerS3({
  s3,
  bucket:env.s3.bucketName,
  acl: "private",
  contentType: multerS3.AUTO_CONTENT_TYPE.bind(multerS3),
  key: (req, file, cb) => {
    let folder = "others";
    if (file.fieldname === "profileImage") folder = "profiles";
    if (file.fieldname === "images")folder ="products";

    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

export const uploadS3 = multer({ storage });
