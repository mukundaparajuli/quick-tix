import { Request, Response } from "express";
import ApiResponse from "../types/api-response";
import { UploadService } from "../services/upload.service";
import ApiError from "../types/api-error";
import asyncHandler from "../utils/async-handler";

export const uploadImage = asyncHandler(async (req: Request, res: Response) => {
    if (!req.file) {
        throw new ApiError(400, "No file uploaded");
    }

    const result = await UploadService.uploadImage(req.file);

    new ApiResponse(res, 200, "Image uploaded successfully", {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes
    });
});

export const deleteImage = asyncHandler(async (req: Request, res: Response) => {
    const { publicId } = req.params;

    if (!publicId) {
        throw new ApiError(400, "Public ID is required");
    }

    await UploadService.deleteImage(publicId);

    new ApiResponse(res, 200, "Image deleted successfully");
});