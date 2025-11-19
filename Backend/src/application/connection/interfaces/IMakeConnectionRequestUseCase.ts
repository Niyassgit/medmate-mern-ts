export interface IRepMakeConnectionRequestUseCase {
  execute(doctorId: string, userId?: string): Promise<string>;
}
