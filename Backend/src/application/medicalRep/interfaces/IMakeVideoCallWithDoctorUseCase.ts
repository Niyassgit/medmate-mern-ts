export interface IMakeVideoCallWithDoctorUseCase {
    execute(doctorId: string, userId?: string): Promise<string | void>;
}