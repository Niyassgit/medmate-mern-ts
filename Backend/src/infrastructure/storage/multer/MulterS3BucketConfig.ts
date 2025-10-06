import AWS from "aws-sdk";
import multer from "multer";


AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region:process.env.AWS_REGION,
});


export const uploadS3=multer({
    storage:multerS3({
        s3,
        bucket:process.env.AWS_BUCKET_NAME!,
        acl:" public-read",
        contentType:multerS3.AUTO_CONTENT_TYPE,
        key:(req,file,cb)=>{
            const fileName=`products/${Date.now()}-${file.originalname}`;
            cb(null,fileName);
        }
    })
})