import dotenv from "dotenv";

dotenv.config();

export const env = {
  port: process.env.PORT || 5000,
  databaseurl: process.env.DATABASE_URL || "",
};
