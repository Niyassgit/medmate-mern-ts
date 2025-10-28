import dotenv from "dotenv";

dotenv.config();
function required(key: string, fallback?: string): string {
  const value = process.env[key] || fallback;
  if (!value) throw new Error(`Missing environment variable: ${key}`);
  return value;
}


export const env = {
  node_env:required("NODE_ENV"),
  port: Number(required("PORT", "5000")),
  databaseUrl: required("DATABASE_URL"),
  origin: required("ORIGIN", "*"),
  maxAge: Number(process.env.MAX_AGE) || 7 * 24 * 60 * 60 * 1000,
  cloudinary: {
    name: required("CLOUDINARY_CLOUD_NAME"),
    apiKey: required("CLOUDINARY_API_KEY"),
    apiSecret: required("CLOUDINARY_API_SECRET"),
  },
  s3:{
    accessKeyId:required("AWS_ACCESS_KEY_ID"),
    secretAccessKey:required("AWS_SECRET_ACCESS_KEY"),
    region:required("AWS_REGION"),
    bucketName:required("AWS_BUCKET_NAME")
  }
};