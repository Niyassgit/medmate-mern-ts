import { VideoCallEventPublisher } from "../realtime/publishers/VideoCallEventPublisher";
import { AccepDoctorVideoCallRequestUseCase } from "../../application/medicalRep/use-cases/AcceptDoctorVideoCallRequestUseCase";
import { DoctorRepository } from "../repositories/DoctorRepository";
import { MedicalRepRepository } from "../repositories/MedicalRepRepository";
import { AcceptRepVideoCallRequestUseCase } from "../../application/doctor/use-cases/AcceptRepVideoCallRequestUseCase";
export const videoCallEventPublisher = new VideoCallEventPublisher();

const doctorRepository = new DoctorRepository();
const medicalRepRepository = new MedicalRepRepository();

export const acceptDoctorVideoCallUseCase =
  new AccepDoctorVideoCallRequestUseCase(
    doctorRepository,
    videoCallEventPublisher
  );

export const acceptRepVideoCallUseCase = new AcceptRepVideoCallRequestUseCase(
  medicalRepRepository,
  videoCallEventPublisher
);
