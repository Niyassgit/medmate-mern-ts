import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import { connectDB } from "./config/db";
import { LoginRoute } from "./presentation/http/routes/LoginRoute";
import { MedicalRepRoutes } from "./presentation/http/routes/RepRoutes";
import { DoctorRoutes } from "./presentation/http/routes/DoctorRoutes";
import { superAdminRoutes } from "./presentation/http/routes/SuperAdminRoutes";
import { ErrorHandler } from "./presentation/http/middlewares/ErrorHandler";


dotenv.config();
const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({
  origin:"http://localhost:5173",
  credentials:true,
}))

const startServer = async () => {
  try {
    await connectDB();

    app.use("/api/doctor", new DoctorRoutes().router);
    app.use("/api/rep", new MedicalRepRoutes().router);
    app.use("/api/admin",new superAdminRoutes().router);
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
