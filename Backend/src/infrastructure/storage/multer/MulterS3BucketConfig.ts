import AWS from "aws-sdk";
import { S3Client } from "@aws-sdk/client-s3";
import multer from "multer";
import multerS3 from "multer-s3";
import { env } from "../../../config/env";

const s3 = new S3Client({
    region: env.s3.region,
    credentials:{accessKeyId: env.s3.accessKeyId, secretAccessKey: env.s3.secretAccessKey}
});

const storage = multerS3({
  s3,
  bucket:env.s3.bucketName,
  acl: "public-read",
  contentType: multerS3.AUTO_CONTENT_TYPE,
  key: (req, file, cb) => {
    let folder = "others";
    if (file.fieldname === "profileImage") folder = "profiles";

    const fileName = `${folder}/${Date.now()}-${file.originalname}`;
    cb(null, fileName);
  },
});

export const uploadS3 = multer({ storage });
