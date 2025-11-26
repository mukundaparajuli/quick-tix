import { $axios } from '../lib/axios';

export class UploadService {
    static async uploadImage(file: File): Promise<{
        url: string;
        publicId: string;
        width: number;
        height: number;
        format: string;
        bytes: number;
    }> {
        const formData = new FormData();
        formData.append('image', file);

        const response = await $axios.post('/upload/image', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        return response.data.data;
    }

    static async deleteImage(publicId: string): Promise<void> {
        await $axios.delete(`/upload/image/${publicId}`);
    }
}