import http from "http";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import path from "path";
import morgan from "morgan";
import { env } from "./infrastructure/config/env";
import { fileURLToPath } from "url";
import { connectDB } from "./infrastructure/config/db";
import { LoginRoute } from "./presentation/http/routes/AuthRoute";
import { MedicalRepRoutes } from "./presentation/http/routes/MedicalRepRoutes";
import { DoctorRoutes } from "./presentation/http/routes/doctorRoutes";
import { SuperAdminRoutes } from "./presentation/http/routes/superAdminRoutes";
import { ErrorHandler } from "./presentation/http/middlewares/ErrorHandler";
import { CommonRoutes } from "./presentation/http/routes/CommonRoutes";
import { WebhookRoutes } from "./presentation/http/routes/WebhookRoutes";
import { initSocket } from "./infrastructure/realtime/SocketGateway";
import logger from "./infrastructure/logger/Logger";
// import { GuestRoutes } from "./presentation/http/routes/GuestRoutes";

const app = express();

app.use("/api/webhook", new WebhookRoutes().router);

app.use(express.json());
app.use(cookieParser());
app.use(morgan("dev"));
app.use(
  cors({
    origin: env.origin,
    credentials: true,
  })
);
const server = http.createServer(app);
initSocket(server);

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
    app.use("/api/common", new CommonRoutes().router);
    // app.use("/api/guest",new GuestRoutes().router);

    app.use(ErrorHandler);

    server.listen(env.port, () => {
      logger.info(` server running on port ${env.port}`);
    });
  } catch (err) {
    const error = err as Error;
    logger.error(`Failed to start server:${error.message}`);
    process.exit(1);
  }
};

startServer().catch((err) => {
  logger.error(`Failed to start app:${err}`);
  process.exit(1);
});
