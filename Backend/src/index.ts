import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import { connectDB } from "./config/db";
import { MedicalRepRoutes } from "./presentation/http/routes/repRoutes";
import { DoctorRoutes } from "./presentation/http/routes/doctorRoutes";

dotenv.config();
const app =express();
app.use(cors());
app.use(express.json());
connectDB();

 app.use("/api/doctor",new DoctorRoutes().router);
 app.use("/api/rep",new MedicalRepRoutes().router)

app.listen(process.env.PORT || 5000,()=>{
    console.log(`🚀 server running on port ${process.env.PORT || 5000}`);
})