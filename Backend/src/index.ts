import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import morgan from "morgan";
import { fileURLToPath } from "url";
import { connectDB } from "./config/db";
import { LoginRoute } from "./presentation/http/routes/LoginRoute";
import { MedicalRepRoutes } from "./presentation/http/routes/MedicalRepRoutes";
import { DoctorRoutes } from "./presentation/http/routes/DoctorRoutes";
import { SuperAdminRoutes } from "./presentation/http/routes/SuperAdminRoutes";
import { ErrorHandler } from "./presentation/http/middlewares/ErrorHandler";

dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: process.env.ORIGIN,
    credentials: true,
  })
);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const uploadsPath = path.join(__dirname, "infrastructure/storage/uploads");

app.use("/uploads", express.static(uploadsPath));

const startServer = async () => {
  try {
    await connectDB();

    app.use("/api/doctor", new DoctorRoutes().router);
    app.use("/api/rep", new MedicalRepRoutes().router);
    app.use("/api/admin", new SuperAdminRoutes().router);
    app.use("/api/auth", new LoginRoute().router);

    app.use(ErrorHandler);
    app.listen(process.env.PORT || 5000, () => {
      console.log(` server running on port ${process.env.PORT || 5000}`);
    });
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
};

startServer().catch((err) => {
  console.error("Failed to start app:", err);
  process.exit(1);
});