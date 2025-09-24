import bcrypt from "bcryptjs";
import { IBcryptService } from "../../domain/common/services/IHashService";

export class BcryptServices implements IBcryptService {
  private readonly saltRounds = 10;

  async hash(value: string): Promise<string> {
    return bcrypt.hash(value, this.saltRounds);
  }

  async compare(value: string, hashedValue: string): Promise<boolean> {
    return bcrypt.compare(value, hashedValue);
  }
}
