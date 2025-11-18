export interface IRepAcceptConnectionRequestUseCase {
  execute(doctorId: string, userId?: string): Promise<string>;
}
