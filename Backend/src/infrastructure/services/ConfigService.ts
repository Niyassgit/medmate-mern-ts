import { IConfigService } from "../../domain/common/services/IConfigService";
import { env } from "../config/env";

export class ConfigService implements IConfigService {
  getOrigin(): string {
    return env.origin;
  }
}

