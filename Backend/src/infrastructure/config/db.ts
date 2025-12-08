import { PrismaClient } from "@prisma/client";
import logger from "../logger/Logger";

export const prisma = new PrismaClient();

export const connectDB = async () => {
  try {
    await prisma.$connect();
    logger.info("✅ Database Connected");
  } catch (error) {
    logger.error("❌ Database connection failed", error);
    process.exit(1);
  }
};
