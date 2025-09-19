import { IOtpRecord } from "../entities/IOtpRecord";
import { IResendOtpRecord } from "../entities/IResendOtpRecord";
import { OtpPurpose } from "../../../domain/common/types/OtpPurpose";

export interface IOtpService {
  generateOtp(
    userId: string,
    purpose: OtpPurpose
  ): Promise<{ otp: string; record: IOtpRecord | null }>;
  findOtp(userId: string, purpose: OtpPurpose): Promise<IOtpRecord | null>;
  deleteOtp(id: string, purpose: OtpPurpose): Promise<void>;
  updateOtp(userId: string, purpose: OtpPurpose): Promise<IResendOtpRecord>;
}
