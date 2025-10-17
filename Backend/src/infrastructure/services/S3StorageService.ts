import { GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import {s3} from "../../config/S3Client";
import {env} from "../../config/env";
import { IStorageService } from "../../application/common/services/IStorageService";


export class s3StorageService implements IStorageService{
    async generateSignedUrl(key: string): Promise<string> {
        const command=new GetObjectCommand({
            Bucket:env.s3.bucketName,
            Key:key,
        });


        return await getSignedUrl(s3,command,{expiresIn:3600});
    }
}