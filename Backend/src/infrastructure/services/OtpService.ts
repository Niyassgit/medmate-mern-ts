import bcrypt from "bcryptjs";
import { prisma } from "../database/prisma";
import { IOtpService } from "../../domain/common/services/IOtpService";
import { IOtpRecord } from "../../domain/common/entities/IOtpRecord";
import { OtpPurpose } from "../../domain/common/types/OtpPurpose";
import { IResendOtpRecord } from "../../domain/common/entities/IResendOtpRecord";
import { ErrorMessages } from "../../shared/Messages";

export class OtpService implements IOtpService {
  async generateOtp(
    userId: string,
    purpose: OtpPurpose
  ): Promise<{ otp: string; record: IOtpRecord }> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashed = await bcrypt.hash(otp, 6);
    const record = await prisma.otpVerification.create({
      data: {
        userId,
        otp: hashed,
        purpose,
        expiredAt: new Date(Date.now() + 1 * 60 * 1000),
        createdAt: new Date(),
      },
    });
    return { otp, record };
  }

  async findOtp(
    userId: string,
    purpose: OtpPurpose
  ): Promise<IOtpRecord | null> {
    const otpRecord = await prisma.otpVerification.findFirst({
      where: { userId, purpose },
      orderBy: { createdAt: "desc" },
    });
    return otpRecord ? otpRecord : null;
  }

  async deleteOtp(userId: string, purpose: OtpPurpose): Promise<void> {
    const otpRecord = await prisma.otpVerification.findFirst({
      where: { userId, purpose },
      orderBy: { createdAt: "desc" },
    });
    if (otpRecord) {
      await prisma.otpVerification.delete({
        where: { id: otpRecord.id },
      });
    }
  }

  async updateOtp(
    userId: string,
    purpose: OtpPurpose
  ): Promise<IResendOtpRecord> {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const hashed = await bcrypt.hash(otp, 6);
    await prisma.otpVerification.updateMany({
      where: { userId, purpose },
      data: {
        otp: hashed,
        expiredAt: new Date(Date.now() + 1 * 60 * 1000),
        createdAt: new Date(),
      },
    });
    const otpRecord = await prisma.otpVerification.findFirst({
      where: { userId, purpose },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      throw new Error(ErrorMessages.FAILED_TO_UPDATE_OTP);
    }
    return {
      otp,
      otpRecord,
    };
  }
}
