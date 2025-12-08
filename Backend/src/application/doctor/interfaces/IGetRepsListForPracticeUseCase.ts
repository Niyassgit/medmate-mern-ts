import { RepListForPracticeDTO } from "../dto/RepListForPracticeDTO";

export interface IGetRepsListForPracticeUseCase {
  execute(userId: string): Promise<RepListForPracticeDTO[]>;
}

