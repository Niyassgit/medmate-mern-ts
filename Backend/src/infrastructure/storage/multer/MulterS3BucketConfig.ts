// import AWS from "aws-sdk";
// import multer from "multer";
// import multerS3 from "multer-s3";

// const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
//   region: process.env.AWS_REGION!,
// });

// const storage = multerS3({
//   s3,
//   bucket: process.env.AWS_BUCKET_NAME!,
//   acl: "public-read", // like Cloudinary public URLs
//   contentType: multerS3.AUTO_CONTENT_TYPE,
//   key: (req, file, cb) => {
//     let folder = "others";
//     if (file.fieldname === "profileImage") folder = "profiles";

//     const fileName = `${folder}/${Date.now()}-${file.originalname}`;
//     cb(null, fileName);
//   },
// });

// export const uploadS3 = multer({ storage });
