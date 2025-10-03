import cloudinary from "../../config/cloudinaryConfig";
import { ICloudinaryService } from "../../domain/common/services/ICloudinaryService";
import streamifier from "streamifier";

export class CloudinaryService implements ICloudinaryService{

   async uploadProfileImage(userId: string, file: Express.Multer.File): Promise<string> {
    if (!file || !file.buffer) {
      throw new Error("No file buffer found");
    }

    return new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "profiles",
          public_id: `${userId}-${Date.now()}`,
        },
        (error, result) => {
          if (error) return reject(error);
          if (!result?.secure_url) return reject(new Error("Failed to get Cloudinary URL"));
          resolve(result.secure_url);
        }
      );

      streamifier.createReadStream(file.buffer).pipe(uploadStream);
    });
  }
}