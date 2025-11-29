import cloudinary from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";

export class UploadService {
    static async uploadImage(file: Express.Multer.File): Promise<UploadApiResponse> {
        console.log("Uploading file:", file.originalname);
        return new Promise((resolve, reject) => {
            // Add timeout for the upload
            const timeout = setTimeout(() => {
                reject(new Error("Upload timeout - please check your Cloudinary credentials and network connection"));
            }, 60000); // 60 second timeout

            const uploadStream = cloudinary.uploader.upload_stream(
                {
                    folder: 'quick-tix',
                    resource_type: 'image',
                    public_id: `${Date.now()}-${file.originalname.split('.')[0]}`,
                    transformation: [
                        { width: 1000, height: 1000, crop: 'limit' },
                        { quality: 'auto' }
                    ],
                    timeout: 60000
                },
                (error, result) => {
                    clearTimeout(timeout);
                    if (error) {
                        console.error("Cloudinary upload error:", error);
                        reject(error);
                    } else if (!result) {
                        reject(new Error("Upload failed - no result returned"));
                    } else {
                        console.log("Upload successful:", result.secure_url);
                        resolve(result as UploadApiResponse);
                    }
                }
            );

            uploadStream.on('error', (err) => {
                clearTimeout(timeout);
                console.error("Upload stream error:", err);
                reject(err);
            });

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