export interface IMakeVideoCallWithRepUseCase {
    execute(repId: string, userId?: string): Promise<string | void>;
}