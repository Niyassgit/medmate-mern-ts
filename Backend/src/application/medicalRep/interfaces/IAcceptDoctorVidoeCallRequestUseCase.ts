import { SessionDescription } from "../../../shared/videoCall/SessionDescription";

export interface IAcceptDoctorVidoeCallRequestUseCase {
  execute(doctorId: string, answer: SessionDescription, userId?: string): Promise<void>;
}
