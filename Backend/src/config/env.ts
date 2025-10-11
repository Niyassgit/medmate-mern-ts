import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  databaseurl: process.env.DATABASE_URL || "",
  origin:process.env.ORIGIN,
  maxAge:Number(process.env.MAX_AGE) ||7 * 24 * 60 * 60 * 1000,
};
