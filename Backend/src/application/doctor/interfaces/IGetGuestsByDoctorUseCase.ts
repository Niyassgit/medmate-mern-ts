export interface IGetGuestsByDoctorUseCase {
  execute(userId: string, search?: string): Promise<any[]>;
}

