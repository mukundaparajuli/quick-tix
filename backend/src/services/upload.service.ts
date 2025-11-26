import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

export class UploadService {
    static async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
        return new Promise((resolve, reject) => {
            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'quick-tix',
                    resource_type: 'image',
                    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
                    transformation: [
                        { width: 1000, height: 1000, crop: 'limit' },
                        { quality: 'auto' }
                    ]
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result as UploadApiResponse);
                    }
                }
            );

            uploadStream.end(file.buffer);
        });
    }

    static async deleteImage(publicId: string): Promise<any> {
        return new Promise((resolve, reject) => {
            cloudinary.uploader.destroy(publicId, (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result);
                }
            });
        });
    }
}